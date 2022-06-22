const express  = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const authMiddleware = require('./authmiddleware');

let categoryList = ["전체", "일상", "쇼핑", "노하우", "애견/반려동물"];

let boardList = [
	{no:1, subject:"나의 일상 정리", content:"요즘 뭔가 평소보다 이상하게 시간이 더 빠르게 지나간것 같기도 하고 날씨도 좋아진것 같기도 하고 뭐 빠르게 지나가는 것 같습니다.\n아무튼 내 일상을 간만에 끄적여봅니다.", writer:"testid1", writedate:"2021-08-09 13:00:00", poster:"1.jpg", viewcount: 10, category:1},
	{no:2, subject:"아이스크림 틀 리뷰~ 집에서 즐겨요.", content:"안녕하세요. 맘입니다.^^\n날씨가 더워지는 요즘 아이들이 시원한 음료수나 아이스크림을 많이 찾습니다.\n그래서 음료수로 간단하게 아이스크림을 만들 수 있는 틀을 리뷰하려고 합니다.", writer:"testid2", writedate:"2021-08-09 13:10:00", poster:"2.jpg", viewcount: 10, category:2},
	{no:3, subject:"도배 쉽게 하는 방법", content:"오늘은 도배지의 종류와 도배하는 방법, 부분 도배하는 방법을 알려드리겠습니다.\n도배지 종 및 특징\n실크(PVC) 벽지, 합지(종이) 벽지, 천연 벽지, 뮤럴(벽화) 벽지, 방염 벽지 등이 있습니다.", writer:"testid3", writedate:"2021-08-09 13:20:00", poster:"3.jpg", viewcount: 10, category:3},
	{no:4, subject:"2022 반려동물 박람회 후기", content:"2022 팻페어 반려동물 박람회를 다녀온 후기입니다.\n3일간 일산에서 반려동물 박람회가 열렸어요~!!\n구경거리도 많고 저렴하게 간식을 구매할 수 있어 좋았습니다.", writer:"testid1", writedate:"2022-03-26 14:00:00", poster:"4.jpg", viewcount: 20, category:4},
	{no:5, subject:"가평 애견펜션 - 아침고요수목원 근처", content:"봄맞이 나들이 겸 댕댕이 퍼피와 함께 아침고요수목원 근처에 있는 애견펜션에 놀러 갔어요.\n아침고요수목원 근처라 찾아가기 쉽고 사장님도 친절하십니다.", writer:"testid2", writedate:"2022-03-26 15:10:00", poster:"5.JPG", viewcount: 30, category:4},
	{no:6, subject:"모종심기와 화분 분갈이 방법", content:"예전에 배란다를 보니 화초들이 상태가 말이 아니더라고요.\n이러면 안되겠다는 생각이 들어서 조금씩 관리하기 시작하였습니다.\n저와 같은 분들이 많이 있을 것 같아서 저만의 화초 관리 노하우를 알려드리고 합니다.", writer:"testid3", writedate:"2022-03-26 16:20:00", poster:"6.JPG", viewcount: 40, category:3},
	{no:7, subject:"포켓몬 득템", content:"친구한테 받은 편의점 1만원 모바일상품권으로 편의점에 간식 사러 들렸습니다.\n그런데 운이 좋았는지 포켓몬 빵이 하나 남아 있었습니다. 망설임 없이 바로 빵과 과자, 음료수 구매했습니다.", writer:"testid1", writedate:"2022-03-26 17:30:00", poster:"7.jpg", viewcount: 50, category:1},
	{no:8, subject:"휴대용 UV 살균기", content:"코로나로 집 받을 나갔다오면 핸드폰부터 가방, 옷까지 혹시나 하는 생각에 찜찜함이 있었다.\n그래서 쇼핑몰을 검색해보니 UV 살균기를 휴대할 수 있는 제품들이 많이 있었다.\n그 중에서 모바일과 연결하여 사용할 수 있는 제품이 있어 구매하였다.", writer:"testid2", writedate:"2022-03-26 18:40:00", poster:"8.jpg", viewcount: 60, category:2},
	{no:9, subject:"이케아 광명점에서 폭풍 구매", content:"안녕하세요! ㅎㅎ 오랜만에 일상으로 인사드립니다.\n사실 집에만 있다가 코에 바람도 넣을 겸 드라이브도 할 겸 이케아 광명점에 왔습니다.\n오늘 이케아에서 폭풍 구매한 내역을 공개하고자 합니다.", writer:"testid3", writedate:"2022-03-26 19:50:00", poster:"9.JPG", viewcount: 70, category:1},
	{no:10, subject:"통밀과자 만들기 체험", content:"오늘은 강원도에 있는 통밀과자를 만들 수 있는 체험장을 다녀왔습니다.\n아침 9시부터 11시까지 두시간 동안 가족들과 함께 빵 체험과 통밀과자를 만들었습니다.", writer:"testid1", writedate:"2022-03-26 21:00:00", poster:"10.jpg", viewcount: 80, category:1},
	{no:11, subject:"애견동반 가능한 카페", content:"이번에는 전주에 갔을 때 반련견과 함께 갈 수 있는 카페를 몇 군데 다녀왔습니다.\n오늘 방문한 곳 중 하나인데요.\n제 마음에 쏙 꽂혀버린 카페입니다.", writer:"testid2", writedate:"2022-03-27 00:30:00", poster:"11.JPG", viewcount: 15, category:4},
	{no:12, subject:"혼자하는 에어컨 청소법", content:"에어컨 커버없이 관리되는 에어컨들은 냉기가 나오는 입구에 먼지가 많이 쌓이게 됩니다.\n이런 먼지들을 쉽고 간편하게 청소하는 방법이 있어 알려드립니다.", writer:"testid3", writedate:"2022-03-27 00:30:00", poster:"12.jpg", viewcount: 20, category:3},
	{no:13, subject:"푸짐하고 맛이 괜찮았던 국물 라뽁이", content:"안녕하세요. 저는 우리나라에서 파는 모든 국물 라뽁이를 먹고 소개드리고자 하는 라짱입니다.\n저는 주말을 맞아 국물맛 괜찮은 라뽁이를 리뷰해 드리고자 합니다.", writer:"testid1", writedate:"2022-03-27 00:30:00", poster:"13.jpg", viewcount: 25, category:2}
	];

// 정렬 해시맵(HashMap)
var hashmapSortby = []; 

// 작성자 오름차순 정렬
hashmapSortby["writer.asc"] = function(comp1, comp2) {
	var comp1UC = comp1.writer.toUpperCase();
	var comp2UC = comp2.writer.toUpperCase();
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};

// 작성자 내림차순 정렬
hashmapSortby["writer.desc"] = function(comp1, comp2) {
	var comp1UC = comp1.writer.toUpperCase();
	var comp2UC = comp2.writer.toUpperCase();
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};

// 작성날짜 오름차순 정렬
hashmapSortby["writedate.asc"] = function(comp1, comp2) {
	var comp1UC = new Date(comp1.writedate).getTime();
	var comp2UC = new Date(comp2.writedate).getTime();
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};
	
// 작성날짜 내림차순 정렬
hashmapSortby["writedate.desc"] = function(comp1, comp2) {
	var comp1UC = new Date(comp1.writedate).getTime();
	var comp2UC = new Date(comp2.writedate).getTime();
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};

// 게시물 필터
function filtering(req, boardList) {
	// 필터된 배열
	var filtered = [];
	// 반복 카운트
	var loopCount = 0;
	
	// 필터 제외
	const excludeFilter = ["countperpage", "pageno", "pagesize", "sortby"];
	// 필터
	for (queryName in req.query) {
		if (!excludeFilter.includes(queryName.toLowerCase())) {
			// 대상 칼럼 명
			var columnName = queryName;
			// 비교문
			var compareCondition = "eq";
			// 비교값
			var compareValue = req.query[queryName];
			if (typeof compareValue == "string") {
				var pos = compareValue.indexOf(":");
				if (pos > 0) {
					compareCondition = compareValue.substr(0, pos);
					compareValue = compareValue.substring(pos+1);
				}
				if (loopCount == 0) {
					filtered = boardList.filter(function(element) {
						return filter(element, columnName, compareCondition, compareValue);
					});
				} else {
					filtered = filtered.filter(function(element) {
						return filter(element, columnName, compareCondition, compareValue);
					});
				}
				loopCount++;
			} else if (Array.isArray(compareValue)) {
				for (var index = 0; index < compareValue.length; index++) {
					// 비교문
					var arCompareCondition = "eq";
					// 비교값
					var arCompareValue = compareValue[index];
					var pos = arCompareValue.indexOf(":");
					if (pos > 0) {
						arCompareCondition = arCompareValue.substr(0, pos);
						arCompareValue = arCompareValue.substring(pos+1);
					}
					if (loopCount == 0) {
						filtered = boardList.filter(function(element) {
							return filter(element, columnName, arCompareCondition, arCompareValue);
						});
					} else {
						filtered = filtered.filter(function(element) {
							return filter(element, columnName, arCompareCondition, arCompareValue);
						});
					}
					loopCount++;
				}
			}
			if (filtered.length == 0) {
				break;
			}
		}
	}
	
	if (loopCount == 0) {
		filtered = boardList;
	}
	
	return filtered;
};

// 게시물 필터
function filter(element, columnName, compareCondition, compareValue) {
	var result = false;
	if (typeof element[columnName] == "string") {
		// 문자열 비교
		if (compareCondition == "eq") {
			result = (element[columnName] == compareValue);
		} else if (compareCondition == "ei") {
			result = (element[columnName].toUpperCase() == compareValue.toUpperCase());
		} else if (compareCondition == "ne") {
			result = (element[columnName] != compareValue);
		}
	} else if (typeof element[columnName] == "number") {
		// 숫자 비교
		if (compareCondition == "eq") {
			result = (element[columnName] == compareValue);
		} else if (compareCondition == "lt") {
			result = (element[columnName] < compareValue);
		} else if (compareCondition == "le") {
			result = (element[columnName] <= compareValue);
		} else if (compareCondition == "gt") {
			result = (element[columnName] > compareValue);
		} else if (compareCondition == "ge") {
			result = (element[columnName] >= compareValue);
		} else if (compareCondition == "ne") {
			result = (element[columnName] != compareValue);
		}
	}
	return result;
};


// 게시물 페이지네이션
function pagination(totalCount, countPerPage, pageSize, pageNo) {
	// 페이지네이션 정보
	var paginationInfo = {};
	
	// 마지막 페이지 번호(전체 페이지 크기)
	var lastPageNo = Math.floor(totalCount / countPerPage) + (totalCount % countPerPage== 0 ? 0 : 1);
	// 시작 페이지 번호
	var startPageNo = 1;
	// 페이지 사이즈로 페이지 번호를 나눈 몫만큼 페이지 시작 번호 변경
	var start = Math.floor(pageNo / pageSize);
	if (start >= 1) {
		// 그렇지만 나머지가 없으면 현재 페이지 번호가 마지막 페이지 번호와 같아 감소
		if (pageNo % pageSize == 0){
			start--;
		}
		startPageNo = (start * pageSize) + 1;
	}
	// 종료 페이지 번호
	var endPageNo = (startPageNo - 1) + pageSize;
	// 그렇지만 종료 페이지 번호가 마지막 페이지 번호보다 크면 마지막 페이지 번호로 변경
	if (endPageNo > lastPageNo) {
		endPageNo = lastPageNo;
	}
	// 이전 페이지 번호 활성화 여부
	var enablePrevPageNo = true;
	if ((pageNo - 1) == 0) {
		enablePrevPageNo = false;
	}
	// 다음 페이지 번호 활성화 여부
	var enableNextPageNo = true;
	if ((pageNo + 1) > lastPageNo) {
		enableNextPageNo = false;
	}
	// 이전 페이지 사이즈 번호
	var prevPageSizeNo = startPageNo - 1;
	// 이전 페이지 사이즈 번호 활성화 여부
	var enablePrevPageSizeNO = true;
	if (prevPageSizeNo == 0) {
		enablePrevPageSizeNO = false;
	}
	// 다음 페이지 사이즈 번호
	var nextPageSizeNo = endPageNo + 1;
	// 다음 페이지 사이즈 번호 활성화 여부
	var enableNextPageSizeNO = true;
	if (nextPageSizeNo > lastPageNo) {
		enableNextPageSizeNO = false;
	}
	
	// 페이지네이션 정보
	paginationInfo.totalCount = totalCount;
	paginationInfo.countPerPage = countPerPage;
	paginationInfo.pageSize = pageSize;
	paginationInfo.startPageNo = startPageNo;
	paginationInfo.endPageNo = endPageNo;
	paginationInfo.lastPageNo = lastPageNo;
	paginationInfo.pageNo = pageNo;
	paginationInfo.enablePrevPageNo = enablePrevPageNo;
	paginationInfo.enableNextPageNo = enableNextPageNo;
	paginationInfo.prevPageSizeNo = prevPageSizeNo;
	paginationInfo.enablePrevPageSizeNO = enablePrevPageSizeNO;
	paginationInfo.nextPageSizeNo = nextPageSizeNo;
	paginationInfo.enableNextPageSizeNO = enableNextPageSizeNO;
	
	return paginationInfo;
}

// 게시물 정렬
function sortBy(boardList, sortby) {
	// 정렬 배열
	var arSortby = null;
	
	if (sortby == undefined || typeof sortby == "undefined" || sortby == null) {
		arSortby = [];
	} else {
		arSortby = sortby.split(",");
	}
	
	if (arSortby.length > 0) {
		boardList.sort(function(comp1, comp2) {
			var result = 0;
			for (var index = 0; index < arSortby.length; index++) {
				if (hashmapSortby[arSortby[index]] != null) {
					result = hashmapSortby[arSortby[index]](comp1, comp2);
					if (result == 0) {
						continue;
					} else {
						break;
					}
				}
			}
			return result;
		});
	}
}

// 조회 수 오름차순 정렬
hashmapSortby["viewcount.asc"] = function(comp1, comp2) {
	var comp1UC = comp1.viewcount;
	var comp2UC = comp2.viewcount;
	if (comp1UC < comp2UC) {
		return -1;
	} else if (comp1UC > comp2UC) {
		return 1;
	}
	return 0;
};

// 조회 수 내림차순 정렬
hashmapSortby["viewcount.desc"] = function(comp1, comp2) {
	var comp1UC = comp1.viewcount
	var comp2UC = comp2.viewcount
	if (comp1UC < comp2UC) {
		return 1;
	} else if (comp1UC > comp2UC) {
		return -1;
	}
	return 0;
};

router.get('/', function(req, res, next) {
	console.log("REST API Get Method - Read All");
	
	// 필터된 게시판
	var filteredBoardList = filtering(req, boardList);
	
	// 정렬
	var sortby = req.query.sortby;
	sortBy(filteredBoardList, sortby);
	
	// 페이지 크기
	var countPerPage = req.query.countperpage;
	// 페이지 번호
	var pageNo = req.query.pageno;
	// 페이지 사이즈
	var pageSize = req.query.pagesize;
	
	if (countPerPage == undefined || typeof countPerPage == "undefined" || countPerPage == null) {
		countPerPage = 10;
	} else {
		countPerPage = parseInt(countPerPage);
	}
	if (pageSize == undefined || typeof pageSize == "undefined" || pageSize == null) {
		pageSize = 10;
	} else {
		pageSize = parseInt(pageSize);
	}
	if (pageNo == undefined || typeof pageNo == "undefined" || pageNo == null) {
		pageNo = 1;
	} else {
		pageNo = parseInt(pageNo);
	}
	
	// 전체 크기
	var totalCount = filteredBoardList.length;
	
	// 페이지네이션 정보
	var paginationInfo = pagination(totalCount, countPerPage, pageSize, pageNo);
	
	// 시작 번호
	var startItemNo = ((pageNo - 1) * countPerPage);
	// 종료 번호
	var endItemNo = (pageNo * countPerPage) - 1;
	// 종료 번호가 전체 크기보다 크면 전체 크기로 변경
	if (endItemNo > (totalCount - 1)) {
		endItemNo = totalCount - 1;
	}
	
	var boardPageList = [];
	if (startItemNo < totalCount) {
		for (var index = startItemNo; index <= endItemNo; index++) {
			var filteredBoardItem = filteredBoardList[index];
			
			var boardPageItem = {};
			boardPageItem.no = filteredBoardItem.no;
			boardPageItem.subject = filteredBoardItem.subject;
			if (filteredBoardItem.content.length > 100) {
				boardPageItem.content = filteredBoardItem.content.substr(0, 100);
			} else {
				boardPageItem.content = filteredBoardItem.content;
			}
			boardPageItem.writer = filteredBoardItem.writer;
			boardPageItem.writedate = filteredBoardItem.writedate;
			boardPageItem.poster = "/asset/board/files/" + filteredBoardItem.poster;
			boardPageItem.viewcount = filteredBoardItem.viewcount;
			boardPageItem.categoryText = categoryList[filteredBoardItem.category];

			boardPageList.push(boardPageItem);
		}
	}
	
	res.json({success:true, data:boardPageList, pagination:paginationInfo});
});

router.get('/:no', function(req, res, next) {
	console.log("REST API Get Method - Read " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		res.json({success:true, data:boardItem});
	} else {
		res.status(404);
		res.json({success:false, errormessage:'not found'});
	}
});

router.post('/', authMiddleware, function(req, res, next) {
	console.log("REST API Post Method - Create");
	var boardLastItem = boardList.reduce((previous, current) => previous.no > current.no ? previous:current);
	var boardItem = new Object();
	boardItem.no = boardLastItem.no + 1;
	boardItem.subject = req.body.subject;
	boardItem.content = req.body.content;
	boardItem.writer = req.tokenInfo.memberId;
	boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	boardList.push(boardItem);
	res.json({success:true});
});

router.put('/:no', authMiddleware, function(req, res, next) {
	console.log("REST API Put Method - Update " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		if (boardItem.writer == req.tokenInfo.memberId) {
			boardItem.subject = req.body.subject;
			boardItem.content = req.body.content;
			boardItem.writedate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
			res.json({success:true});
		} else {
			res.status(403);
			res.json({success:false, errormessage:'id are not identical'});
		}
	} else {
		res.status(404);
		res.json({success:false, errormessage:'not found'});
	}
});

router.delete('/:no', authMiddleware, function(req, res, next) {
	console.log("REST API Delete Method - Delete " + req.params.no);
	var boardItem = boardList.find(object => object.no == req.params.no);
	if (boardItem != null) {
		if (boardItem.writer == req.tokenInfo.memberId) {
			var index = boardList.indexOf(boardItem);
			if (index >= 0) {
				boardList.splice(index, 1);
				res.json({success:true});
			} else {
				res.status(404);
				res.json({success:false, errormessage:'not found'});
			}
		} else {
			res.status(403);
			res.json({success:false, errormessage:'id are not identical'});
		}
	} else {
		res.status(404);
		res.json({success:false, errormessage:'not found'});
	}
});

module.exports = router;
