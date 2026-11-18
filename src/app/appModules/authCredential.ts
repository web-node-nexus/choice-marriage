
export class authCredential{
    constructor(
        public profile_id:String,
        public profile_name:String,
        public profile_email:String,
        public isLogin:boolean,
        public role:any,
        private _refreshkey:any,
        public expiration_date:any,
    
    ){
    
    }

    
    get token(){
        const currentDate = Math.floor(new Date().getTime() / 1000);           
        if(this.expiration_date> currentDate){
            return this._refreshkey;
        }
        return null
    }

}