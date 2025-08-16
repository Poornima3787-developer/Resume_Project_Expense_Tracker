const mongoose=require('mongoose');

const downloadedFileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  downloadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DownloadedFile', downloadedFileSchema);
