document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyAfcDULBN3mL9fSTr5_qvjgb8km1udLcXI';
    const searchButton = document.getElementById('searchButton');
    const channelSearch = document.getElementById('channelSearch');
    const channelInfo = document.getElementById('channelInfo');

    searchButton.addEventListener('click', searchChannel);
    channelSearch.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchChannel();
        }
    });

    function searchChannel() {
        const channelName = channelSearch.value.trim();
        if (!channelName) {
            // Mostrar un mensaje de error si el campo está vacío
            channelInfo.innerHTML = '<p class="text-center text-red-500">Por favor, ingresa el nombre del canal.</p>';
            return;
        }

        // Limpiar el mensaje de error anterior si había uno
        channelInfo.innerHTML = '';

        // Realiza una solicitud para buscar el canal por nombre
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${channelName}&type=channel`)
            .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud de búsqueda de canal'))
            .then(data => {
                if (data.items.length === 0) {
                    channelInfo.innerHTML = '<p class="text-center text-red-500">No se encontró ningún canal con ese nombre.</p>';
                    return;
                }

                const channelId = data.items[0].id.channelId;
                getChannelInfo(channelId);
            })
            .catch(error => console.error('Error:', error));
    }

    const getChannelInfo = channelId => {
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`)
            .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud a la API de YouTube'))
            .then(data => {
                const { snippet, statistics } = data.items[0];
                const profilePictureUrl = snippet.thumbnails.medium.url;
                const subscriberCount = parseInt(statistics.subscriberCount).toLocaleString();
                const viewCount = parseInt(statistics.viewCount).toLocaleString();
                const channelName = snippet.title;

                channelInfo.innerHTML = `
                    <div class="bg-gray-100 py-5 rounded-lg shadow-lg text-center">
                        <h2 class="text-2xl font-semibold">${channelName}</h2>
                        <div class="flex items-center justify-center">
                            <img class="my-4 rounded-lg" src="${profilePictureUrl}" alt="Foto de perfil">
                        </div>
                        <p class="text-gray-600">Suscriptores</p>
                        <p class="text-xl font-semibold">${subscriberCount}</p>
                        <p class="text-gray-600">Total de vistas</p>
                        <p class="text-xl font-semibold">${viewCount}</p>
                    </div>
                `;
            })
            .catch(error => console.error('Error:', error));
    }
});
