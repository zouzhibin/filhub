const Koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const KoaStatic = require('koa-static')
const mount = require('koa-mount')
const views = require('koa-view')
const koaBody = require('koa-body')
const fs = require('fs')
const utils = require('./utils')

const app = new Koa()
const apiRouter = new Router()
const router = new Router()

app.use(views(__dirname + '/views',{map:{
        html:"nunjucks"
    }}))


const STORAGE = path.join(__dirname,'../filehub_storage')
const dataPath = path.join(__dirname,'./data.json')

router.get('/',async ctx=>{
    let files = fs.readdirSync(STORAGE);
    let arrayFileList = files.map(item=>{
        let data = fs.statSync(path.join(STORAGE,item))
        // console.log(data.mtime.getTime())
        let time = utils.format(data.mtime)
        console.log('time',data)
        return {
            name:item,
            time,
            ts:data.mtime.getTime()
        }
    })
    console.log('files',arrayFileList)
    utils.writeJson(dataPath,JSON.stringify(arrayFileList))
    ctx.render('index',{data:arrayFileList})
})
if(!fs.existsSync(STORAGE)){
    fs.mkdirSync(STORAGE)
}

apiRouter.post('/upload',async ctx=>{
    console.log('hhhhh')
    let file = ctx.request.files.file
    const reader = fs.createReadStream(file.path)
    const upStream = fs.createWriteStream(`${STORAGE}/${file.name}`)
    reader.pipe(upStream)
    ctx.type = 'json'
    ctx.body = {
        error: 0,
        data: {
            fileName: `${file.name}`,
        }
    }
    // const file = ctx.request.files.file
    // console.log('file----',file)
})




app.use(mount('/',router.routes()))
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 1024 * 1024 * 1024
    }
}))
app.use(mount('/file',KoaStatic(STORAGE)))
app.use(mount('/api', apiRouter.middleware()))
app.listen('8889',(err,arg)=>{
    if(err) throw err
    console.log('启动服务........8889')
})



