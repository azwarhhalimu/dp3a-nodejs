const getYtId = (url) => {
    const uri = url.split("?");
    return uri[1].replace("v=", "");
}

module.exports = getYtId;