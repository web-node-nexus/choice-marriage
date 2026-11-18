import { Component, Injectable, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiParameterScript } from 'src/app/script/api-parameter';
import { AppService } from 'src/app/services/app.service';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1200,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      760: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    nav: false,
    autoplay: true,
    autoplaySpeed: 1500
  }
  bannerSlider: any[] = []
  isLogin: boolean = false;
  authInfo: any
  imageURL = ""
  constructor(
    private auth: AuthService,
    private AppService: AppService
  ) { }


  ngOnInit(): void {
    this.imageURL = this.AppService.getFilePath()
    this.auth.authCredential.subscribe((res: any) => {
      if (res) {

        this.isLogin = res.profile_id != null ? true : false;
        this.authInfo = this.auth.getAuthStatus() ? this.auth.getAuthStatus() : res;


      }
    })

    if(this.AppService['appConfig']?.['bannerImageList'] && this.AppService['appConfig']['bannerImageList'].length>0){
      this.AppService['appConfig']['bannerImageList'].forEach((e: any) => {
        this.bannerSlider.push({ "image_url": this.imageURL + "storage/banner/" + e.image })
      })

    }
    

  }


  // bulletSlider(index: any) {

  //   console.log("index", index);

  //   const nextEl = document.querySelector("#next");
  //   const previousEl = document.querySelector("#previous");
  //   const sliderEl: any = document.querySelector("#slider");
  //   const sliderImgs = sliderEl?.querySelectorAll("img");
  //   const totalImgs = sliderImgs?.length;
  //   var imgWidth: any;
  //   imgWidth = sliderEl.offsetWidth;
  //   // console.log(sliderEl);


  //   const bullets = document.querySelectorAll(".bullet");
  //   bullets.forEach((element) => element.classList.remove("active"));
  //   sliderEl.scrollLeft = imgWidth * index;
  //   bullets[index].classList.add("active");
  // }


  // toggleBullet(prev: any) {
  //   const nextEl = document.querySelector("#next");
  //   const previousEl = document.querySelector("#previous");
  //   const sliderEl: any = document.querySelector("#slider");
  //   const sliderImgs = sliderEl?.querySelectorAll("img");
  //   const totalImgs = sliderImgs?.length;
  //   const bullets = document.querySelectorAll(".bullet");
  //   var imgWidth: any;
  //   imgWidth = sliderEl.offsetWidth;
  //   let nextSlide;

  //   if (prev) {
  //     nextSlide = Math.round(sliderEl.scrollLeft) - imgWidth;
  //   } else {
  //     nextSlide = Math.round(sliderEl.scrollLeft) + imgWidth;
  //   }

  //   let activeBullet = nextSlide / imgWidth;
  //   bullets.forEach((element) => element.classList.remove("active"));
  //   if (
  //     Math.round(activeBullet) !== totalImgs &&
  //     Math.round(activeBullet) !== -1
  //   ) {
  //     bullets[Math.round(activeBullet)].classList.add("active");
  //   } else {
  //     bullets[0].classList.add("active");
  //   }
  // };



  // onNextClick() {


  //   const nextEl = document.querySelector("#next");
  //   const previousEl = document.querySelector("#previous");
  //   const sliderEl: any = document.querySelector("#slider");
  //   const sliderImgs = sliderEl?.querySelectorAll("img");
  //   const totalImgs = sliderImgs?.length;
  //   var imgWidth: any;
  //   imgWidth = sliderEl.offsetWidth;
  //   // console.log(sliderEl);
  //   sliderEl.scrollLeft += imgWidth;
  //   //return to beginning
  //   const sliderFullWidth = sliderEl.scrollWidth;
  //   const lastSlide = sliderFullWidth - imgWidth;

  //   this.toggleBullet(false);

  //   if (lastSlide == Math.round(sliderEl.scrollLeft)) {
  //     sliderEl.scrollLeft = 0;
  //   }
  // }




  // onPreviousClick() {
  //   const nextEl = document.querySelector("#next");
  //   const previousEl = document.querySelector("#previous");
  //   const sliderEl: any = document.querySelector("#slider");
  //   const sliderImgs = sliderEl?.querySelectorAll("img");
  //   const totalImgs = sliderImgs?.length;
  //   var imgWidth: any;
  //   imgWidth = sliderEl.offsetWidth;
  //   // console.log(sliderEl);
  //   // const imgWidth = sliderEl.offsetWidth;
  //   sliderEl.scrollLeft -= imgWidth;

  //   this.toggleBullet(true);
  // }

}
