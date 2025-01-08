import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public productList: Array<GetAllProductsResponse> = [];

  constructor(private productsService: ProductsService, private messageService: MessageService, private ProductsDtService: ProductsDataTransferService) {}
  ngOnInit(): void {
    this.getProductsDatas();
  }

  getProductsDatas(): void {
    this.productsService.getAllProducts().pipe(
            takeUntil(this.destroy$)
          ).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productList = response;
          this.ProductsDtService.setProductsDatas(this.productList);
          console.log("Dados dos produtos: ", this.productList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: "Erro ao buscar produtos",
          life: 3000
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
