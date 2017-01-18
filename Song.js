/**
 * Created by congchen on 1/16/17.
 */


class Song{
    constructor(singer,name,album,url,album_pic){
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.url = url;
        this.album_pic = album_pic;
    }
}

module.exports = Song;