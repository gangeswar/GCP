const {Firestore} = require('@google-cloud/firestore');

const db = new Firestore();
const collection = 'album';


async function list() {
  const snapshot = await db
    .collection(collection)
    .get();


  if (snapshot.empty) {
    return [];
  }

  const album = [];

  snapshot.forEach((doc) => {
    let img = doc.data()[0];
    img.id = doc.id;
    album.push(img);
  });
  

  return album
}

async function update(id, data) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }

  data.id = ref.id;
  data = {...data};
  console.log(data);
  await ref.set(data);
  return data;
}

async function create(data) {
  return await update(null, data);
}

async function read(id) {
  const doc = await db
    .collection(collection)
    .doc(id)
    .get();

  if (!doc.exists) {
    throw new Error('No such document!');
  }
  return doc.data();
}

async function _delete(id) {
  await db
    .collection(collection)
    .doc(id)
    .delete();
}

module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};