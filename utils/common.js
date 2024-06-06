export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const getRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  const roomId = sortedIds.join("-");
  return roomId;
};

// export const fromDate = (date) => {
//   var day = date.getDate();
//   var month = date.getMonth();
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   return `${day}/${month} - ${hours}:${minutes}`;
// };
