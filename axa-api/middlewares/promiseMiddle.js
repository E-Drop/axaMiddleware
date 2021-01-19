exports.CompanyListIO = 
	function(user){
		return new Promise(
			function (resolve, reject) {
				var match = (user.admin) ? {} : { "_id" : ObjectId(user.companyid) } ;
				try {
					Company.aggregate(Aggregations(match)).then((companies)=>{
						if(companies.length > 0){
							resolve(companies);
						}else{
							resolve([]);
						}
					});
				} catch (err) {
					reject("Error company list");
				}
			}
		);
	};