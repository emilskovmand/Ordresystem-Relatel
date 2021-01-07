import axios from 'axios'


export async function UploadAudio(OrdreId, file) {
    let formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/audio/upload', formData);

    return [response, response.status];
};

export async function GetOrderAudioPaths(OrdreId) {

};