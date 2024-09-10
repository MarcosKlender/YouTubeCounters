document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "AIzaSyAfcDULBN3mL9fSTr5_qvjgb8km1udLcXI";
  const searchButton = document.getElementById("searchButton");
  const channelForm = document.getElementById("channelForm");
  const channelSearch = document.getElementById("channelSearch");
  const channelInfo = document.getElementById("channelInfo");
  const errorMessage = document.getElementById("errorMessage");

  const handleSearch = () => {
    const channelName = channelSearch.value.trim();
    if (!channelName) {
      displayError("*Por favor, ingresa el nombre del canal.");
      return;
    }

    // Limpia el mensaje de error si ya se ha mostrado
    clearError();

    // Continuar con la búsqueda
    searchChannel(channelName);
  };

  // Agrega listeners para buscar el canal
  searchButton.addEventListener("click", handleSearch);
  channelSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSearch();
  });

  const displayError = (message) => {
    errorMessage.textContent = message;
  };

  const clearError = () => {
    errorMessage.textContent = "";
  };

  const searchChannel = (channelName) => {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${channelName}&type=channel`;
    fetch(url)
      .then(handleResponse)
      .then((data) => {
        if (data.items.length === 0) {
          displayError("No se encontró ningún canal con ese nombre.");
        }

        const channelId = data.items[0].id.channelId;
        fetchChannelInfo(channelId);
      })
      .catch(handleError);
  };

  const fetchChannelInfo = (channelId) => {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    fetch(url)
      .then(handleResponse)
      .then((data) => {
        const { snippet, statistics } = data.items[0];
        renderChannelInfo(snippet, statistics);
      })
      .catch(handleError);
  };

  const handleResponse = (response) => {
    if (!response.ok) {
      throw new Error("Error en la solicitud a la API.");
    }
    return response.json();
  };

  const handleError = (error) => {
    console.error("Error:", error);
  };

  const renderChannelInfo = (snippet, statistics) => {
    const { thumbnails, title } = snippet;
    const { subscriberCount, viewCount } = statistics;
    const formattedSubscribers = parseInt(subscriberCount).toLocaleString();
    const formattedViews = parseInt(viewCount).toLocaleString();

    channelForm.remove();
    channelInfo.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 class="text-2xl font-bold">${title}</h2>
        <div class="flex items-center justify-center">
          <img class="my-4 rounded-lg" src="${thumbnails.medium.url}" alt="Perfil de ${title}">
        </div>
        <p class="text-gray-600">Suscriptores</p>
        <p class="text-xl font-semibold">${formattedSubscribers}</p>
        <p class="text-gray-600">Total de Visitas</p>
        <p class="text-xl font-semibold">${formattedViews}</p>
        <button onClick="window.location.reload();"
          class="bg-red-700 text-white mt-4 px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600">
          Reiniciar
        </button>
      </div>
    `;
  };
});
