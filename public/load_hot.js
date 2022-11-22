const hotList = document.querySelector(".hot-list"); //Список популярных артистов
const popularTracksList = document.querySelector(".popular-tracks-list"); //Список популярных треков
const hot_api_key = "687f75d4e98de92fbb1997c826992306"; //Апи ключ


start_hot();
/**
 * Входная функция для загрузки всех данных и отображения их
 */
async function start_hot(){
    let fetchedData = await fetch_all_hot_data();
    fill_hot_artists(fetchedData.data_hot_artists, fetchedData.artist_tags_datas);
    fill_hot_tracks(fetchedData.data_hot_tracks, fetchedData.track_tags_datas);
}
/**
 * 
 * @param {string} category Категория:
 *  
 * "Artists" : Информация о популярных артистах
 * 
 * "Tracks" : Информация о популярных треках
 * 
 * "ArtistTags" : Информация о популярных тегах артиста
 * 
 * "TrackTags" : Информация о популярных тегах трека
 * 
 * @param {number} [amount = 7] Количество объектов, не касается тегов
 * @param {object} [target = null]  Целевой объект для извлечения информации о тегах
 * @returns {object} Информация по запрашиваемой категории
 */
async function fetch_data(category, amount = 7, target = null){
    let requestString = ""
    try{
        switch(category){
            case "Artists":
                requestString = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${hot_api_key}&format=json&limit=${amount}`;
                break;
            case "Tracks":
                requestString = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${hot_api_key}&format=json&limit=${amount}`;
                break;
            case "ArtistTags":
                requestString = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${target.name}&api_key=${hot_api_key}&format=json`;
                break;
            case "TrackTags":
                requestString = `http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=${hot_api_key}&artist=${target.artist.name}&track=${target.name}&autocorrect[1]&format=json`;
                break;
        }
    }
    catch{
        alert("Failed to parse data");
        return null;
    }
    const response = await fetch(requestString).catch(() => {
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
    let data_hot_artists; //Список популярных артистов
    let data_hot_tracks; // Список популярных треков
    let artist_tags_datas = []; //Список объектов списков тегов для популярных артистов
    let track_tags_datas = []; //Список объектов списков тегов для популярных треков
    await Promise.all([fetch_data("Artists", 8), fetch_data("Tracks", 8)]).then(
        ([data1, data2]) => {
            data_hot_artists = data1;
            data_hot_tracks = data2;
        }
    )
    const promises_artists_tags = data_hot_artists.artists.artist.map((artist) => fetch_data("ArtistTags", undefined,target = artist));
    const promises_tracks_tags = data_hot_tracks.tracks.track.map((track) => fetch_data("TrackTags", undefined, target = track));
    await Promise.all([...promises_artists_tags, ...promises_tracks_tags]).then(
        (data1 = []) => {
            artist_tags_datas = data1.slice(0, promises_artists_tags.length);
            track_tags_datas = data1.slice(promises_artists_tags.length, promises_artists_tags.length + promises_tracks_tags.length);
        }
    )
    return {
        data_hot_artists : data_hot_artists,
        data_hot_tracks : data_hot_tracks,
        artist_tags_datas : artist_tags_datas,
        track_tags_datas : track_tags_datas
    }
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
