import { NgModule, Component, ViewChild, enableProdMode, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CommonModule } from '@angular/common';
import { DxSchedulerModule,
         DxSchedulerComponent,
         DxTemplateModule } from 'devextreme-angular';
import { CalendarService, MovieData, TheatreData, Data } from './calendar.service';
import Query from 'devextreme/data/query';
import { Routes, RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [CalendarService]
})
export class CalendarComponent implements OnInit {

  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  data: Data[];
  currentDate: Date = new Date(2015, 4, 25);
  moviesData: MovieData[];
  theatreData: TheatreData[];

  constructor(service: CalendarService) {
      this.data = service.getData();
      this.moviesData = service.getMoviesData();
      this.theatreData = service.getTheatreData();
  }

  ngOnInit() {}

  onAppointmentFormOpening(data) {
      var that = this,
          form = data.form,
          movieInfo = that.getMovieById(data.appointmentData.movieId) || {},
          startDate = data.appointmentData.startDate;

      form.option("items", [{
          label: {
              text: "Movie"
          },
          editorType: "dxSelectBox",
          dataField: "movieId",
          editorOptions: {
              items: that.moviesData,
              displayExpr: "text",
              valueExpr: "id",
              onValueChanged: function(args) {
                  movieInfo = that.getMovieById(args.value);
                  form.getEditor("director")
                      .option("value", movieInfo.director);
                  form.getEditor("endDate")
                      .option("value", new Date (startDate.getTime() + 60 * 1000 * movieInfo.duration));
              }.bind(this)
          }
      }, {
          label: {
              text: "Director"
          },
          name: "director",
          editorType: "dxTextBox",
          editorOptions: {
              value: movieInfo.director,
              readOnly: true
          }
      }, {
          dataField: "startDate",
          editorType: "dxDateBox",
          editorOptions: {
              width: "100%",
              type: "datetime",
              onValueChanged: function(args) {
                  startDate = args.value;
                  form.getEditor("endDate")
                      .option("value", new Date (startDate.getTime() + 60 * 1000 * movieInfo.duration));
              }
          }
      }, {
          name: "endDate",
          dataField: "endDate",
          editorType: "dxDateBox",
          editorOptions: {
              width: "100%",
              type: "datetime",
              readOnly: true
          }
      }, {
          dataField: "price",
          editorType: "dxRadioGroup",
          editorOptions: {
              dataSource: [5, 10, 15, 20],
              itemTemplate: function(itemData) {
                  return "$" + itemData;
              }
          }
      }]);
  }

  getDataObj(objData) {
      for(var i = 0; i < this.data.length; i++) {
          if(this.data[i].startDate.getTime() === objData.startDate.getTime() && this.data[i].theatreId === objData.theatreId)
              return this.data[i];
      }
      return null;
  }

  getMovieById(id) {
      return Query(this.moviesData).filter(["id", "=", id]).toArray()[0];
  }

}


const routes : Routes = [{
  path : 'calendar',
  component: CalendarComponent
}] 


@NgModule({


  imports: [
    CommonModule,
      DxSchedulerModule,
      DxTemplateModule,
      RouterModule.forChild(routes)
  ],
  declarations: [CalendarComponent],
  bootstrap: [CalendarComponent]
})
export class CalendarModule { }

// platformBrowserDynamic().bootstrapModule(CalendarModule);