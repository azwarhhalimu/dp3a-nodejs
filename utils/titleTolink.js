const TitleToLink = (title) => {

    let hasil = title.replace(" ", "-");

    return hasil;
}

module.exports = TitleToLink;