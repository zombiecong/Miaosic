/**
 * Created by congchen on 1/16/17.
 */

const url = require('url');
const Song = require('./Song');

const request = require('request');


class Xiami {
    constructor() {

    }

    static origin_search(keyword, page = 1, limit = 10){
        var urlObj = {
            protocol: 'http:',
            slashes: true,
            hostname: 'api.xiami.com',
            query: {
                'v': '2.0',
                'app_key': '1',
                'key': keyword,
                'page': page,
                'limit': limit,
                'r': 'search/songs',
            },
            pathname: '/web'
        };

        var result = url.format(urlObj);
        // console.log(result);

        return new Promise((y, n) => {
            let headers = {
                'referer': 'http://h.xiami.com/',
                'cookie': 'user_from=2;XMPLAYER_addSongsToggler=0;XMPLAYER_isOpen=0;_xiamitoken=123456789;',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.30 Safari/537.36',
            };
            request.get({url: result, headers: headers}, function (e, r, body) {
                if (e) {
                    n(e);
                } else {
                    // console.log(body);
                    y(JSON.parse(body));
                }
            })

        });
    }

    static search(keyword, page = 1, limit = 10){
        return new Promise((y,n)=>{
            Xiami.origin_search(keyword,page,limit).then(b=>{
                let song_list = b.data.songs;
                // console.log(song_list)

                let songs = [];

                for(let song of song_list){
                    songs.push(downloadUrl(song.song_id));

                    // songs.push(new Song(song.artist_name,
                    //     song.song_name,
                    //     song.album_name,
                    //     song.listen_file,
                    //     song.album_logo)
                    // );
                }

                Promise.all(songs).then(results=>{
                    let new_songs = [];
                    for(let result of results){
                        let [singer,url,song_name,album_logo,album_name] = result;
                        new_songs.push(new Song(singer,
                            song_name,
                            album_name,
                            url,
                            album_logo));
                    }
                    y(new_songs);
                });
                // y(songs);
            });
        });
    }
}

function downloadUrl(id) {
    var urlObj = {
        protocol: 'http:',
        slashes: true,
        hostname: 'www.xiami.com',
        pathname:`/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`
    };

    var result = url.format(urlObj);
    // console.log(result);

    return new Promise((y, n) => {

        request.get({url: result}, function (e, r, body) {
            if (e) {
                n(e);
            } else {
                let data = JSON.parse(body);
                let singer;
                let url;

                //todo(cc): check track list
                let song_name = data.data.trackList[0].name;
                let album_logo = data.data.trackList[0].pic;
                let album_name = data.data.trackList[0].album_name;

                let artist_name = data.data.trackList[0].artist_name;
                let artist_name2;
                if (data.data.trackList[0].singersSource[0]){
                    artist_name2 = data.data.trackList[0].singersSource[0].artistName;
                }
                if(artist_name != artist_name2){
                    singer = `${artist_name}(${artist_name2})`;
                }else{
                    singer = artist_name;
                }

                let url_list = data.data.trackList[0].allAudios;

                for (let song_url of url_list){
                    if (song_url.audioQualityEnum == 'HIGH' && song_url.format == "mp3"){
                        url = song_url.filePath;
                        break;
                    }
                }

                // console.log(singer,url);
                y([singer,url,song_name,album_logo,album_name]);
            }
        })

    });
}

module.exports = Xiami;
//
// let xiami = new Xiami();
// Xiami.origin_search("小幸运").then(s => console.dir(s.data.songs[5]));
// Xiami.search("小幸运",1,4).then(s=>console.log(s));
//
// let id = '1774490672';
// downloadUrl(id).then(e=>{
//     console.log(e);
// })
