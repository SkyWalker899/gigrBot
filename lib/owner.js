const FBAPP = require('./firebase.init');



updateOwnerGigs = (body) => {
    const uid = body['messenger user id'];
    const gig = {
        location: body['gigr_address'],
        need: body['gigr_need'],
        quantity: body['gigr_qantity'],
        time: body['gigr_when']
    }
    FBAPP.FireDB.ref("owners/" + uid).once('value').then((snapshot) => {
        const owner = snapshot.val() || 'undefined';
        if (owner !== 'undefined') {
            let allGigs = owner.gigs
            allGigs.push(gig);
            FBAPP.FireDB.ref('owners/' + uid).update({
                gigs: allGigs
            })
        } else {
            let gigs = [];
            gigs.push(gig);
            FBAPP.FireDB.ref("owners/" + uid).set({
                uid: uid,
                phone: body['gigr_phone'],
                restaurant: body['gigr_address'],
                gigs: gigs
            })
        }
    }, err => console.log(err))
}









module.exports = { updateOwnerGigs }