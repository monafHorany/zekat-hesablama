import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import { Category_operationsService } from 'src/app/services/category_operations.service';

@Component({
  selector: 'app-fatwa-detail',
  templateUrl: './fatwa-detail.page.html',
  styleUrls: ['./fatwa-detail.page.scss'],
})
export class FatwaDetailPage implements OnInit {
  public id: number;
  public fatwaDetail;

  constructor(private route: ActivatedRoute, private categoryService: Category_operationsService) { }

  ngOnInit() {
      this.id = parseInt(this.route.snapshot.params['id']);
      if (this.id) {
        this.categoryService.getFatwaById(this.id).subscribe((res) => {
          this.fatwaDetail = res[0].detail;
        });
      }
  }

}
