const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');
const config = require('config');
const rateLimit = require('express-rate-limit');

const Url = require('../models/Url');

// Rate limiting configuration
const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many URLs shortened from this IP, please try again after 15 minutes'
});

// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten', shortenLimiter, async (req, res) => {
  const { longUrl, customAlias } = req.body;
  const baseUrl = config.get('baseUrl');

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Check long url
  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json('Invalid long url');
  }

  // Handle custom alias
  let urlCode;
  if (customAlias) {
    if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
      return res.status(400).json('Invalid custom alias format');
    }
    urlCode = customAlias;
    const existingAlias = await Url.findOne({ urlCode });
    if (existingAlias) {
      return res.status(400).json('Custom alias is already in use');
    }
  } else {
    urlCode = nanoid(8);
  }

  try {
    let url;
    if (!customAlias) {
      url = await Url.findOne({ longUrl });
      if (url) {
        return res.json(url);
      }
    }

    const shortUrl = baseUrl + '/' + urlCode;

    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date(),
      clicks: 0
    });

    await url.save();

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// @route     GET /api/url/stats/:code
// @desc      Get stats for a short URL
router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      res.json(url);
    } else {
      res.status(404).json('URL not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
