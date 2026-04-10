const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    image: { type: String, trim: true },
    link: { type: String, trim: true },
    category: { type: String, trim: true, lowercase: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

postSchema.index({ title: 'text', excerpt: 'text', content: 'text' })

module.exports = mongoose.model('Post', postSchema)
