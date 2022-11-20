const hotList = document.querySelector(".hot-list"); //Список популярных артистов
const popularTracksList = document.querySelector(".popular-tracks-list"); //Список популярных треков
sessionStorage.setItem("api_key", "687f75d4e98de92fbb1997c826992306"); //Задаем апи ключ
let api_key = sessionStorage.getItem("api_key"); //Апи ключ
sessionStorage.setItem("search_text", ""); //Задаем поисковый запрос
let data_hot_artists; //Список популярных артистов
let data_hot_tracks; // Список популярных треков
let artist_tags_datas = []; //Список объектов спиков тегов для популярных артистов
let track_tags_datas = []; //Список объектов спиков тегов для популярных треков

main_hot();
/**
 * Входня функция для загрузки всех данных и отображения их
 */
async function main_hot(){
    await fetch_all_hot_data();
    await fill_hot_arctists();
    await fill_hot_tracks();
}
/**
 * Функция извлечения списка популярных артистов
 * @returns {Object} Список артистов
 */
async function fetch_hot_arctists(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const artistsAmount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${api_key}&format=json&limit=${artistsAmount}`);
    const data = await response.json();
    return data;
}
/**
 * Функция извлечения списка популярных треков
 * @returns {Object} Список треков
 */
async function fetch_hot_tracks(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const tracksAmount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${api_key}&format=json&limit=${tracksAmount}`);
    const data = await response.json();
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
    await Promise.all(promises_artists_tags);
    await Promise.all(promises_tracks_tags);
}
/**
 * Отображаем информацию об топе артистов
 */
async function fill_hot_arctists(){
    for(let i = 0; i < data_hot_artists.artists.artist.length; i++){
        show_info_artist(data_hot_artists.artists.artist[i], artist_tags_datas[i])
    }
}
/**
 * Отображаем информацию об топе треков
 */
async function fill_hot_tracks(){
    for(let i = 0; i < data_hot_tracks.tracks.track.length; i++){
        show_info_track(data_hot_tracks.tracks.track[i], track_tags_datas[i])
    }
}
/**
 * Функция извлечения данных о топе тегов артиста
 * @param {Object} artist Артист
 */
async function fetch_artist_tags(artist){
    const artist_tags_response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist.name}&api_key=${api_key}&format=json`);
    const artist_tags_data = await artist_tags_response.json();
    artist_tags_datas.push(artist_tags_data);
}
/**
 * Функция извлечения данных о топе тегов артиста
 * @param {Object} track Трек 
 */
async function fetch_tracks_tags(track){
    const track_tags_response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=${api_key}&artist=${track.artist.name}&track=${track.name}&autocorrect[1]&format=json`);
    const track_tags_data = await track_tags_response.json();
    track_tags_datas.push(track_tags_data);
}

/**
 * Функция отображения информации об артисте
 * @param {Object} artist Артист
 * @param {Object[]} artist_tags_data Массив тегов данного артиста
 */
async function show_info_artist(artist, artist_tags_data){
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
async function show_info_track(track, track_tags_data){
    let img_url = "";
    try{
        img_url = track.image[1]["#text"];
    }
    catch(err){
        img_url = "https://lastfm.freetls.fastly.net/i/u/300x300/4128a6eb29f94943c9d206c08e625904.jpg";
    }
    append_small_card(
        track.name,
        track.url,
        track.artist.name,
        track.artist.url,
        img_url,
        track_tags_data.toptags.tag.slice(0,3)
    )

}











