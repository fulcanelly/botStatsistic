# botStatsistic is
 Module that allow you to get statistic of your project usage with node.js 
 
### Example of usage:
 ```js
 ...
  const sqlite3 = require('sqlite3').verbose()
  const dbFile = './statistic.sqlite'
  const db = new sqlite3.Database(dbFile)

  const stat = require('./statistics').statistics
  stat.init(db)

  smtObj.on('action', (action) => {
    a.update(action.user.id)
  })

 ```
