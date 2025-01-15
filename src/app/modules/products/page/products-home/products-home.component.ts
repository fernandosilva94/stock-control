import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productDatas: Array<GetAllProductsResponse> = [];
  
  constructor(private producstService: ProductsService, private producstDtTransferService: ProductsDataTransferService, private router: Router,
              private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.getServiceProductDatas();
  }

  getServiceProductDatas() {
    const productsLoaded = this.producstDtTransferService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productDatas = productsLoaded;
    } else {
      this.getApiProductsDatas();
    }
  }
  
  getApiProductsDatas() {
    this.producstService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productDatas = response;
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos.',
          life: 3000
        })
        this.router.navigate(['/dashboard']);
      }
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
