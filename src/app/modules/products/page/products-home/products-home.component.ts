import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productDatas: Array<GetAllProductsResponse> = [];
  private ref!: DynamicDialogRef;
  
  constructor(private producstService: ProductsService, private producstDtTransferService: ProductsDataTransferService, private router: Router,
              private messageService: MessageService, private confirmationService: ConfirmationService, private dialogService: DialogService) {}
  
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

  handleProductAction(event: EventAction) : void {
    if (event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.productDatas
        }
      })
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getApiProductsDatas()
      })
    }
  }

  handleDeleteProductAction(event: {product_id: string, productName: string}): void {
    this.confirmationService.confirm({
      message: `Confirma a exclusão do produto: ${event.productName}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deleteProduct(event?.product_id)
    })
  }
  deleteProduct(product_id: string) {
    if (product_id) {
      this.producstService.deleteProduct(product_id).pipe(
        takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: "Produto removido com sucesso.",
                life: 3000
              });

              this.getApiProductsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover produto',
              life: 3000
            });
          },
        });
    };
  };
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
