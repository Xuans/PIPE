(function () {
   // import axios from 'axios';
    app.get = (url, data) => {
        return axios({
            url,
            data,
            method: 'GET'
        });
    }
})