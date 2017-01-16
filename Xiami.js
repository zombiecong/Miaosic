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
            hostname: 'api.xiami.com/web',
            query: {
                'v': '2.0',
                'app_key': '1',
                'key': keyword,
                'page': page,
                'limit': limit,
                'r': 'search/songs',
            }
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
                    songs.push(new Song(song.artist_name,
                        song.song_name,
                        song.album_name,
                        song.listen_file)
                    );
                }

                y(songs);
            });
        });
    }
}

module.exports = Xiami;
//
// let xiami = new Xiami();
// xiami.origin_search("小幸运").then(s => console.log(s.data.songs[0]));