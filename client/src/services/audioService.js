import axios from 'axios'


export async function UploadAudio(OrdreId, file) {
    let formData = new FormData();
    formData.append('file', file, file.name);

    const response = await axios.post('/api/audio/upload', formData);

    return [response, response.status];
};

export async function GetOrderRecordings(RecordingsId) {
    const response = await fetch(`/api/order/recordings/${RecordingsId}`);
    return response.json();
};