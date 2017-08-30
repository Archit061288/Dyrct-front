define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('searchCtrl', ['$scope','$rootScope','$state',
        function($scope,$rootScope,$state) {
            $scope.album="";
            $rootScope.searchpoi=false;
            $rootScope.poitypedata="private";
            if($state.current.name == 'common.poilistview')
            {
                $scope.ispoi = true;
            }else{
                $scope.ispoi = false;
            }
            if($state.current.name == 'common.folder')
            {
                $scope.isFolder = true;
            }else{
                $scope.isFolder = false;
            }
            $scope.searchtype = '';
            
            $scope.q = "";
            $scope.folderreq=true;
            $scope.userSearch = function(q){
                $rootScope.$broadcast("userSearch",$scope.q);
            }
            $rootScope.$on("forldereq", function (event, data) {
                
                $scope.isFolder = false;
            })
            $rootScope.$on("forldeback", function (event, data) {
                
                $scope.isFolder = true;
            })
            $scope.checkboxModel = {
       tag : false,
       folder : false,
       owner: false
     };
     
            $scope.userSearchpoiType=function(poitype){
                //console.log(poitype)
                if(poitype=="public")
                {
                    $rootScope.poitypedata="public";
                    $rootScope.searchpoi=true;
                    $scope.type="public";
                    $scope.searchtype = $scope.type;
                    $rootScope.$broadcast("userSearch",$scope.q);
                    
                   // console.log($rootScope.poitypedata)
                 //$rootScope.$broadcast("userSearchpoi",$scope.searchtype);
                }
                if(poitype=="private")
                {
                    $rootScope.poitypedata="private";
                    $scope.type="private";
                    //$scope.q="";
                    $rootScope.$broadcast("userSearch",$scope.q);
                    $rootScope.searchpoi=false;
                }
                 
            }
            
            $scope.userSearchType = function(foldertype){
              // $(".folderdropdown-menu").css("display","block");
               
              console.log($scope.status.isopen,"statuys")
                if(foldertype=="public")
                {
                $scope.publicfolder=[];
                $scope.type="";
                //console.log($scope.checkboxModel.tag,$scope.checkboxModel.folder,$scope.checkboxModel.owner)
                if($scope.checkboxModel.tag)
                {
                 $scope.publicfolder.push("tag");   
                }
                if($scope.checkboxModel.owner)
                {
                 $scope.publicfolder.push("owner");   
                }
                if($scope.checkboxModel.folder)
                {
                 $scope.publicfolder.push("folder");   
                }
                if($scope.publicfolder.length>0)
                $scope.type=$scope.publicfolder.join();
            else
            {
                $scope.q = "";
                    $rootScope.$broadcast("userSearch",$scope.q);
                   
                    $scope.type="";
            }
                }
                else if(foldertype=="private")
                {
                    console.log("private")
                    $scope.q = "";
                    $rootScope.$broadcast("userSearch",$scope.q);
                    $scope.checkboxModel = {
                    tag : false,
                    folder : false,
                    owner: false
                };
                    $scope.type="";
                }
                //console.log($scope.type);
                $scope.searchtype = $scope.type;
                console.log($scope.searchtype,"here")
                $rootScope.$broadcast("userSearchType",$scope.searchtype);
            }        
            $rootScope.$on("userSearchType", function (event, data) {
                $scope.searchtype = data;
                console.log($scope.searchtype,"if")
            })
            $rootScope.$on("userSearch", function (event, data) {
                $scope.q = data;
            })
            
             $scope.status = {
                isopen: false
              };
              
            $(".folderdropdown-menu").click(function(e){
            e.stopPropagation(); 
        });
        $(document).click(function(){
         $(".folderdropdown-menu").hide('slow'); 
        });

//              $(".folderdropdown-menu").mouseleave(function(){ 
//                $(this).hide();  
//        });
       

            
            
        }])
});
        