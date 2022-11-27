const hotList = document.querySelector(".hot-list"); //Список популярных артистов
const popularTracksList = document.querySelector(".popular-tracks-list"); //Список популярных треков


start_hot();
/**
 * Входная функция для загрузки всех данных и отображения их
 */
async function start_hot(){
    const fetchedData = await fetch_all_hot_data();
    fill_hot_artists(fetchedData.data_hot_artists, fetchedData.artist_tags_datas);
    fill_hot_tracks(fetchedData.data_hot_tracks, fetchedData.track_tags_datas);
}
/**
 * Извлечение данных
 * @param {string} method Метод извлечения данных
 * @param {string} artist Имя артиста
 * @param {string} track Название трека
 * @param {number} limit Предельное количество объектов
 * @param {string} api_key Апи ключ
 * @returns Результат извлечения данных
 */
async function fetch_data(method, artist, track, limit = 7, api_key = "687f75d4e98de92fbb1997c826992306"){
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${api_key}&artist=${artist}&track=${track}&autocorrect[1]&format=json&limit=${limit}`).catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const data = await response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    return data;
}

/**
 * Функция для сбора всей инофрмации
 */
async function fetch_all_hot_data(){
    const result_data = {
        data_hot_artists : undefined,
        data_hot_tracks : undefined,
        artist_tags_datas : undefined,
        track_tags_datas : undefined
    }
    await Promise.all([fetch_data("chart.gettopartists"), fetch_data("chart.gettoptracks")]).then(
        ([data1, data2]) => {
            result_data.data_hot_artists = data1;
            result_data.data_hot_tracks = data2;
        }
    )
    const promises_artists_tags = result_data.data_hot_artists.artists.artist.map((artist) => fetch_data("artist.gettoptags", artist.name));
    const promises_tracks_tags = result_data.data_hot_tracks.tracks.track.map((track) => fetch_data("track.gettoptags", track.artist.name, track.name));
    await Promise.all([...promises_artists_tags, ...promises_tracks_tags]).then(
        (data1 = []) => {
            result_data.artist_tags_datas = data1.slice(0, promises_artists_tags.length);
            result_data.track_tags_datas = data1.slice(promises_artists_tags.length, promises_artists_tags.length + promises_tracks_tags.length);
        }
    )
    return result_data;
}
/**
 * Отображаем информацию о топе артистов
 * @param {object} data_hot_artists Информация о популярных артистах
 * @param {object[]} artist_tags_datas Объект списков тегов для популярных артистов
 */
function fill_hot_artists(data_hot_artists, artist_tags_datas){
    for(let i = 0; i < data_hot_artists.artists.artist.length; i++){
        show_info_artist(data_hot_artists.artists.artist[i], artist_tags_datas[i])
    }
}
/**
 * Отображаем информацию о топе треков
 * @param {object} data_hot_tracks Информация о популярных треках
 * @param {object[]} track_tags_datas Объект списков тегов для популярных треков
 */
function fill_hot_tracks(data_hot_tracks, track_tags_datas){
    for(let i = 0; i < data_hot_tracks.tracks.track.length; i++){
        show_info_track(data_hot_tracks.tracks.track[i], track_tags_datas[i])
    }
}

/**
 * Функция отображения информации об артисте
 * @param {Object} artist Артист
 * @param {Object[]} artist_tags_data Массив тегов данного артиста
 */
function show_info_artist(artist, artist_tags_data){
    append_big_card(
        artist.name,
        artist.url,
        artist.image[3]["#text"],
        artist_tags_data.toptags.tag.slice(0, 3)
    )
}

/**
 * Функция отображения информации о треке
 * @param {Object} track Трек
 * @param {Object[]} track_tags_data Массив тегов данного трека
 */
function show_info_track(track, track_tags_data){
    let img_url = track?.image[1]["#text"] ?? "https://lastfm.freetls.fastly.net/i/u/300x300/4128a6eb29f94943c9d206c08e625904.jpg";
    append_small_card(
        track.name,
        track.url,
        track.artist.name,
        track.artist.url,
        img_url,
        track_tags_data.toptags.tag.slice(0,3)
    )
}
