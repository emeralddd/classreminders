// const Database = require("@replit/database")
// const db = new Database()

const alert = async (id) => {

}

module.exports = async ({}) => {
    const lists = await db.list()

    const now = new Date().getTime()

    for(const i of lists) {
        const val = await db.get(i)
        if(val.next < now) {
            alert(i)
            val.next+=604800000
            db.set(i,val)
        }
    }
}