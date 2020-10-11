import {Component, OnInit} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import {DbServiceService} from 'src/app/services/db-service.service';
import {AnimationController, ModalController, Platform} from '@ionic/angular';
import { CharityComponent } from 'src/app/component/charity/charity.component';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import { LoadingController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {BannerComponent} from '../../component/banner/banner.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  locenviroment = environment;
  banners;
  id: number;
  goldPrice: number;
  silverPrice: number;
  goldTotalPrice: number;
  moneyTotalPrice: number;
  tradeTotalPrice: number;
  silverTotalPrice: number;
  stockTotalPrice: number;
  mutualTotalPrice: number;
  totalAmount: number;
  translatedCurrencyName: string;
    theFinalTotal: number;
    private sub: Subscription;
    private allRates: any;
    public currentBase: string;
    private currencyIndex: any;
    public moneyCurrencyIndex: number;
    public translatedMoneyCurrencyName: any;
    lastOperation;
    currencyList: any[];
  constructor(private animationCtrl: AnimationController,
    private platform: Platform,
              private db: DbServiceService, private modalCtrl: ModalController,
              private categoryService: Category_operationsService, public loadingController: LoadingController,
              private route: ActivatedRoute) {
                
      this.sub = this.route.params.subscribe(params => {
          this.id = +params.id;
      });
  }
 ngOnInit() {
     console.log("ngOnInit")
    
    this.getGlobalRatesObject().then(_=>{
        Storage.get({ key: 'setting' }).then(resp => {
            
            if (resp && resp.value){
                const setting = JSON.parse(resp.value);
                this.currentBase =  setting.currency;
                console.log(this.currentBase)
                if(this.currentBase){
                    this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.currentBase];
                    this.categoryService.getCurrencies().subscribe(responseData=>{
                        this.currencyList=responseData;
                    this.currencyIndex = responseData.findIndex(I => I.code === this.currentBase);
                console.log(this.currencyIndex)
                   
                
                this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase];
                this.translatedCurrencyName = responseData[this.currencyIndex].name;
            })
            }
            
        }
    
        }); 
    });
  

    
    
     
     this.categoryService.getBanners().subscribe(resData => {
        this.banners =  resData;
      });
     
     this.categoryService.getAllCharities();
    
 }
    async ionViewDidEnter() {
        console.log("ionViewDidEnter")

  
            Storage.get({ key: 'setting' }).then(resp => {
                
                if (resp && resp.value){
                    const setting = JSON.parse(resp.value);
                    this.currentBase =  setting.currency;
                    console.log(this.currentBase)
                    if(this.currentBase){
                        this.goldPrice = this.allRates.rates.gold * this.allRates.rates.rates[this.currentBase];
                        this.categoryService.getCurrencies().subscribe(responseData=>{
                            this.currencyList=responseData;
                        this.currencyIndex = responseData.findIndex(I => I.code === this.currentBase);
                    console.log(this.currencyIndex)
                       
                    
                    this.silverPrice = this.allRates.rates.silver * this.allRates.rates.rates[this.currentBase];
                    this.translatedCurrencyName = responseData[this.currencyIndex].name;
                })
                }
                
            }
        
 

        if (this.platform.is('cordova') || this.platform.is('capacitor')) {
            this.db.getoperations().subscribe(data => {
                this.lastOperation = data;

                this.goldTotalPrice = 0;
                this.silverTotalPrice = 0;
                this.moneyTotalPrice = 0;
                this.tradeTotalPrice = 0;
                this.stockTotalPrice = 0;
                this.mutualTotalPrice = 0;
                this.totalAmount = 0;
       if (this.lastOperation && this.goldPrice){
           for (let i = 0; i < this.lastOperation.length; i++) {
               if (this.lastOperation[i].category_id === 1) {
                   this.goldTotalPrice += (+this.lastOperation[i].d_val_1 +
                       +this.lastOperation[i].d_val_2 * 0.875 +
                       +this.lastOperation[i].d_val_3 * 0.75) * +this.goldPrice;
               } else if (this.lastOperation[i].category_id === 2) {
                   if (this.lastOperation[i].currency_type !== this.currentBase) {
                       this.moneyTotalPrice += this.lastOperation[i].d_val_1
                       * (1 / this.allRates.rates.rates[this.lastOperation[i].currency_type])
                       * this.allRates.rates.rates[this.currentBase];
                   }
                   if (this.lastOperation[i].currency_type == this.currentBase) {
                       this.moneyTotalPrice += +this.lastOperation[i].d_val_1;
                   }
               } else if (this.lastOperation[i].category_id === 3) {
                   this.tradeTotalPrice += +this.lastOperation[i].d_val_1;
               } else if (this.lastOperation[i].category_id === 4) {
                   this.silverTotalPrice += this.lastOperation[i].d_val_1 * this.silverPrice;
               } else if (this.lastOperation[i].category_id === 5) {
                   this.stockTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
               } else if (this.lastOperation[i].category_id === 6) {
                   this.mutualTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
               }
           }
       }
           
     
                setTimeout(() => {
           this.animationCtrl.create()
               .addElement(document.querySelector('.new'))
               .duration(500)
               .iterations(1)
               .keyframes([
                   {offset: 0, background: '#00ffd4'},
                   {offset: 0.25, background: '#08ecc4'},
                   {offset: 0.5, background: '#0a8071'},
                   {offset: 0.75, background: '#012d26'},
                   {offset: 1, background: 'var(--background)'}
               ])
                       .play();
                   }, 500);
               
            });
        }else{
            this.categoryService.getAllOperations().subscribe(data => {
                this.lastOperation = data;
                this.goldTotalPrice = 0;
                this.silverTotalPrice = 0;
                this.moneyTotalPrice = 0;
                this.tradeTotalPrice = 0;
                this.stockTotalPrice = 0;
                this.mutualTotalPrice = 0;
                this.totalAmount = 0;
                if (this.lastOperation && this.goldPrice){
           for (let i = 0; i < this.lastOperation.length; i++) {
               if (this.lastOperation[i].category_id === 1) {
                   this.goldTotalPrice += (+this.lastOperation[i].d_val_1 +
                       +this.lastOperation[i].d_val_2 * 0.875 +
                       +this.lastOperation[i].d_val_3 * 0.75) * +this.goldPrice;
               } else if (this.lastOperation[i].category_id === 2) {
                   if (this.lastOperation[i].currency_type !== this.currentBase) {
                       this.moneyTotalPrice += this.lastOperation[i].d_val_1
                       * (1 / this.allRates.rates.rates[this.lastOperation[i].currency_type])
                       * this.allRates.rates.rates[this.currentBase];
                   }
                   if (this.lastOperation[i].currency_type == this.currentBase) {
                       this.moneyTotalPrice += +this.lastOperation[i].d_val_1;
                   }
               } else if (this.lastOperation[i].category_id === 3) {
                   this.tradeTotalPrice += +this.lastOperation[i].d_val_1;
               } else if (this.lastOperation[i].category_id === 4) {
                   this.silverTotalPrice += this.lastOperation[i].d_val_1 * this.silverPrice;
               } else if (this.lastOperation[i].category_id === 5) {
                   this.stockTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
               } else if (this.lastOperation[i].category_id === 6) {
                   this.mutualTotalPrice += +this.lastOperation[i].d_val_1 * +this.lastOperation[i].d_val_2;
               }
           }
       }
           
     
                setTimeout(() => {
           this.animationCtrl.create()
               .addElement(document.querySelector('.new'))
               .duration(500)
               .iterations(1)
               .keyframes([
                   {offset: 0, background: '#00ffd4'},
                   {offset: 0.25, background: '#08ecc4'},
                   {offset: 0.5, background: '#0a8071'},
                   {offset: 0.75, background: '#012d26'},
                   {offset: 1, background: 'var(--background)'}
               ])
                       .play();
                   }, 500);

            });
        }
    });
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            mode: 'ios',
            spinner: 'circular',
            duration: 500
        });
        await loading.present();
               
    }
  
    
            

    async getGlobalRatesObject() {
        const ret = await Storage.get({key: 'GLOBAL-RATES'});
        this.allRates = JSON.parse(ret.value);
        }
    async charityModal() {
      const homeCharityModal = await this.modalCtrl.create({
        component: CharityComponent,
        cssClass: 'my-custom-class'
      });
      return await homeCharityModal.present();
    }
    ionViewWillLeave() {
     this.id = -1;
     this.sub.unsubscribe();
}
    async openBanner(bannerIndex) {
        const modal = await this.modalCtrl.create({
            component: BannerComponent,
            componentProps: {
                banners: this.banners,
                id: bannerIndex
            }
        });
        modal.present();
    }
    
    getMoneyCurrencyName(currency: string) {
        if(this.currencyList){
            const name = this.currencyList.filter(I => I.code === currency);
            return name[0].name;
        }
    }
}
