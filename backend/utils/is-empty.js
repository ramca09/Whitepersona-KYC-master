const isEmpty = (data) => {
    return (
        data === undefined || data === null || (typeof data === "string" && data.trim() === "") || (typeof data === "object" && Object.keys(data).length === 0)
    );
};

module.exports = isEmpty;
