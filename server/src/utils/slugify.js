const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/[\s_-]+/g, '-')   // spaces and underscores to hyphens
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens

module.exports = slugify;
