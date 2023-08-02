import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState();
  const [selectedApi, setSelectedApi] = useState('api-tgph-official');
  const [customApi, setCustomApi] = useState('');
  const [subOption, setSubOption] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const pasteHandler = event => {
      if (event.clipboardData && event.clipboardData.items) {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            setSelectedFile(blob);
          }
        }
      }
    };

    window.addEventListener('paste', pasteHandler);

    return () => {
      window.removeEventListener('paste', pasteHandler);
    };
  }, []);

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const apiSelectedHandler = event => {
    setSelectedApi(event.target.value);
  };

  const customApiHandler = event => {
    setCustomApi(event.target.value);
  };

  const subOptionHandler = event => {
    setSubOption(event.target.checked);
  };

  const fileUploadHandler = () => {
    const api = selectedApi === 'custom' ? customApi : selectedApi;
    const formData = new FormData();
    formData.append('image', selectedFile, selectedFile.name);
    axios.post(`/api/upload/${api}`, formData)
      .then(response => {
        setImageUrl(response.data);
        setError(null);
      })
      .catch(error => {
        setError(error.toString());
      });
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  const imageUrlList = subOption && selectedApi.startsWith('api-tgph')
    ? [
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://telegra.ph/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://telegraph.cachefly.net/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://i0.wp.com/telegra.ph/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://i1.wp.com/telegra.ph/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://i2.wp.com/telegra.ph/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://i3.wp.com/telegra.ph/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://im.gurl.eu.org/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://image.196629.xyz/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://img1.131213.xyz/file/'),
      imageUrl.replace(/https:\/\/.*\/file\//, 'https://missuo.ru/file/'),
    ]
    : [imageUrl];

  return (
    <div>
      <div>
        <input type="file" onChange={fileSelectedHandler} />
      </div>
      <div>
        <span>选择上传接口：</span>
        <select value={selectedApi} onChange={apiSelectedHandler}>
          <option value="api-tgph-official">TGPH-Official</option>
          <option value="api-tgph-cachefly">TGPH-Cachefly</option>
          <option value="api-tgph-wp">TGPH-WordPress</option>
          <option value="api-tgph-imgurleuorg">TGPH-ImgurlEuOrg</option>
          <option value="api-tgph-missuoru">TGPH-missuo.ru</option>
          <option value="api-tgph-196629">TGPH-196629</option>
          <option value="api-tgph-131213">TGPH-131213</option>
          <option value="custom">自定义</option>
        </select>
        {selectedApi === 'custom' && <input value={customApi} onChange={customApiHandler} />}
        <button onClick={fileUploadHandler}>Upload</button>
      </div>
      {selectedApi.startsWith('api-tgph') && (
        <div>
          <input type="checkbox" checked={subOption} onChange={subOptionHandler} />
          <span>TGPH SUB</span>
        </div>
      )}
      {imageUrl && imageUrlList.map((url, index) => (
        <div key={index}>
          <button onClick={() => copyUrl(url)}>Copy</button>
          <a href={url}>{url}</a>
        </div>
      ))}
      {error && <div>Error: {error}</div>}
      <footer style={{textAlign: "center", padding: "20px 0"}}>提示：各网站权利归相关网站持有人所有，本网站仅辅助上传用途，无审查、存储功能</footer>
    </div>
  );
}
