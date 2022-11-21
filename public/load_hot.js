const hotList = document.querySelector(".hot-list"); //Список популярных артистов
const popularTracksList = document.querySelector(".popular-tracks-list"); //Список популярных треков
sessionStorage.setItem("api_key", "687f75d4e98de92fbb1997c826992306"); //Задаем апи ключ
const hot_api_key = sessionStorage.getItem("api_key"); //Апи ключ
sessionStorage.setItem("search_text", ""); //Задаем поисковый запрос
let data_hot_artists; //Список популярных артистов
let data_hot_tracks; // Список популярных треков
let artist_tags_datas = []; //Список объектов спиков тегов для популярных артистов
let track_tags_datas = []; //Список объектов спиков тегов для популярных треков

start_hot();
/**
 * Входная функция для загрузки всех данных и отображения их
 */
async function start_hot(){
    await fetch_all_hot_data();
    fill_hot_arctists();
    fill_hot_tracks();
}
/**
 * Функция извлечения списка популярных артистов
 * @returns {Object} Список артистов
 */
async function fetch_hot_arctists(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const artistsAmount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${hot_api_key}&format=json&limit=${artistsAmount}`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const data = await response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    return data;
}
/**
 * Функция извлечения списка популярных треков
 * @returns {Object} Список треков
 */
async function fetch_hot_tracks(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const tracksAmount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${hot_api_key}&format=json&limit=${tracksAmount}`)
    .catch(() => {
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
    await Promise.all([fetch_hot_arctists(), fetch_hot_tracks()]).then(
        ([data1, data2]) => {
            data_hot_artists = data1;
            data_hot_tracks = data2;
        }
    )
    const promises_artists_tags = data_hot_artists.artists.artist.map(fetch_artist_tags);
    const promises_tracks_tags = data_hot_tracks.tracks.track.map(fetch_tracks_tags);
    await Promise.all(promises_artists_tags.concat(promises_tracks_tags));
}
/**
 * Отображаем информацию об топе артистов
 */
function fill_hot_arctists(){
    for(let i = 0; i < data_hot_artists.artists.artist.length; i++){
        show_info_artist(data_hot_artists.artists.artist[i], artist_tags_datas[i])
    }
}
/**
 * Отображаем информацию об топе треков
 */
function fill_hot_tracks(){
    for(let i = 0; i < data_hot_tracks.tracks.track.length; i++){
        show_info_track(data_hot_tracks.tracks.track[i], track_tags_datas[i])
    }
}
/**
 * Функция извлечения данных о топе тегов артиста
 * @param {Object} artist Артист
 */
async function fetch_artist_tags(artist){
    const artist_tags_response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist.name}&api_key=${hot_api_key}&format=json`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const artist_tags_data = await artist_tags_response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    artist_tags_datas.push(artist_tags_data);
}
/**
 * Функция извлечения данных о топе тегов трека
 * @param {Object} track Трек 
 */
async function fetch_tracks_tags(track){
    const track_tags_response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=${hot_api_key}&artist=${track.artist.name}&track=${track.name}&autocorrect[1]&format=json`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const track_tags_data = await track_tags_response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    track_tags_datas.push(track_tags_data);
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
