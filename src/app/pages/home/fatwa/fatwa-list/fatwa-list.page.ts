import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Category_operationsService } from "../../../../services/category_operations.service";

@Component({
  selector: "app-fatwa-list",
  templateUrl: "./fatwa-list.page.html",
  styleUrls: ["./fatwa-list.page.scss"],
})
export class FatwaListPage implements OnInit {
  public sub: Subscription;
  public name: string;
  public id: number;
  public fatwa;

  constructor(
    private route: ActivatedRoute,
    private categoryService: Category_operationsService
  ) {}

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.params["id"]);
    if (this.id) {
      this.categoryService.getFatwaByCategoryId(this.id).subscribe((res) => {
        this.fatwa = res;
      });
    }
  }
}
