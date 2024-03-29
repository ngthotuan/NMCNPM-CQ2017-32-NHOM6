var express = require('express');
var router = express.Router();
var Book = require('../models/book');
let Order=require('../models/giaodich');
var Category = require('../models/category');

router.get('/book-summary', async function(req, res, next) {
    let books = await Book.find({}).lean();
    let orders=await Order.find({});
    console.log(orders);
    let sumtotal=0,sumbook=0, sumkho=0;
    let Arr_Category=new Array();
    for(let i=0;i<books.length;i++)
    {
        sumkho=sumkho+books[i].quantity;
        let temp= await Category.findOne({'categoryid':books[i].category});
        Arr_Category.push(temp.name);
    }
    for(let i=0;i<(await orders).length;i++)
    {
        sumtotal=sumtotal+orders[i].total;
        sumbook=sumbook+orders[i].quantity;
    }
    console.log(Arr_Category )
    res.render('pages/book-summary/index', { pageTitle: 'Thống kê sách', listbook: books ,listcategory:Arr_Category,sumtotal,sumkho,sumbook});
});
router.get('/book-infomation', async function(req, res, next) {
    let minCost = req.query.minPrice;
    let maxCost = req.query.maxPrice;
    if (!minCost) minCost = Number.MIN_SAFE_INTEGER;
    if (!maxCost) maxCost = Number.MAX_SAFE_INTEGER;
    let booksQuery = Book.find({ cost: { $lte: maxCost, $gte: minCost } });
    if (req.query.bookname)
        booksQuery = booksQuery.where('name').regex(req.query.bookname);
    let books = await booksQuery.lean().exec();
    let Arr_Category=new Array();
    for(let i=0;i<books.length;i++)
    {
        let temp= await Category.findOne({'categoryid':books[i].category});
        Arr_Category.push(temp.name);
    }
    console.log(Arr_Category )
    res.render('pages/book-infomation/index', { pageTitle: 'Tra cứu thông tin sách', listbook: books ,listCategory:Arr_Category});
});

router.get('/change-book-info', function(req, res, next) {
    res.render('pages/change-book-info/index', { pageTitle: 'Thay đổi thông tin sách' });
});

module.exports = router;