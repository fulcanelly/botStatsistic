let StrFromUnixTime = time => {
    let resTime = new Date()
    resTime.setTime(time)
    return resTime.toDateString()
}

exports.statistics = class statistics {
    static init(db)
    {
        this.db = db
        //create tables
        db.run(`CREATE TABLE IF NOT EXISTS users(
            userid BLOB,
            msg_today BLOLB DEFAULT 0,
            last_msg_time BLOLB DEFAULT 0
        )`)

        db.run(`CREATE TABLE IF NOT EXISTS days(
            day BLOB,
            uniq_users BLOB,
            requests BLOB
        )
        `)
    }

    static getUser(id) { 
        return new Promise (res => 
            this.db.get(`SELECT * FROM users WHERE userid = ?`, id, (err, row) => res(row || null))
        )
    }

    static getDay(date) {
        return new Promise (res => 
            this.db.get(`SELECT * FROM days WHERE day = ?`, date, (err, row) => res(row || null))
        )
    }

    static updateGlobal(time) {
        return new Promise(async res => {
            let date = StrFromUnixTime(time)
            if(await this.getDay(date))
                this.db.run(`UPDATE days SET uniq_users = uniq_users + 1 WHERE day = ?`, date)
            else
                this.db.run(`INSERT INTO days(day, uniq_users) VALUES(?, 1)`, date)
        })
    }

    //must call when ueser send new m ()sg
    static async update(userid)
    {
        let DayFromUnixTime = time => {
            let resTime = new Date()
            resTime.setTime(time)
            return resTime.getUTCDate()
        }

        let currentTime = Date.now()
        let currentDay = DayFromUnixTime(currentTime)
        let user = await this.getUser(userid)
        let needUpdateGlobal = true

        if(! user)
            this.db.run(`INSERT INTO users VALUES(?, 1, ?)`, userid, currentTime)
        else
        {
            if(DayFromUnixTime(user.last_msg_time) == currentDay)
            {
                let req = `UPDATE users SET msg_today = ? + 1 WHERE userid = ?`
                this.db.run(req, user.msg_today, userid)
                needUpdateGlobal = false
            }
            else
            {
                let req = `UPDATE users SET msg_today = 1, last_msg_time = ? WHERE userid = ?`
                this.db.run(req, user.msg_today, user.last_msg_time, userid)
            }
        }

        if(needUpdateGlobal)
            this.updateGlobal(currentTime)

    }
}

/*
const sqlite3 = require('sqlite3').verbose()
const dbFile = './a.sqlite'
const db = new sqlite3.Database(dbFile)

const sss = require('./statistics')

let a=sss.statistics
a.init(db)
a.update(32)
*/