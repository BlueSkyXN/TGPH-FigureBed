import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer();

export default function uploadImage(req = NextApiRequest, res = NextApiResponse) {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    try {
      const response = await axios.post('https://img1.131213.xyz/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      res.json(`https://img1.131213.xyz${response.data[0].src}`);
    } catch (error) {
      if (error.response) {
        // 请求已发送，但服务器响应的状态码不在 2xx 范围内
        return res.status(error.response.status).json({ error: error.response.status });
      } else if (error.request) {
        // 请求已发送，但没有收到任何响应
        return res.status(500).json({ error: "No response" });
      } else {
        // 请求在设置过程中出现了问题
        return res.status(500).json({ error: "Request setup error" });
      }
    }
  });
}
