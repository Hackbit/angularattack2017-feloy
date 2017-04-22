import { Translation } from './../models/translation';
import { Source, Msg } from './../models/source';
import { BackendService } from './backend.service';
import { Project } from './../models/project';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class ProjectsService {

  public projects$ = new ReplaySubject<Project[]>(1);
  private projects: Project[];

  public currentTranslation$ = new ReplaySubject<Translation>(1);
  private currentTranslation: Translation;
  public currentSource$ = new ReplaySubject<Source>(1);

  constructor(private backend: BackendService) {
    this.projects = this.backend.projectsList();
    this.projects$.next(this.projects);
  }

  public add(p: Project) {
    p.id = 1 + this.projects.reduce((prev: number, curr: Project) => Math.max(prev, curr.id), 0);
    this.projects.push(p);
    this.projects$.next(this.projects);
    this.backend.projectsSave(this.projects);
    return p.id;
  }

  public get(id: number): Project {
    const list = this.projects.filter((p: Project) => p.id === id);
    if (list.length === 1) {
      return list[0];
    } else {
      return null;
    }
  }

  public setCurrentTranslation(tr: Translation) {
    this.currentTranslation = tr;
    this.currentTranslation$.next(tr);
  }

  public setTranslatedMsg(id: string, value: string) {
    const list = this.currentTranslation.msgs.filter( (m: Msg) => m.id === id);
    if (list.length > 0) {
      list[0].content = value;
    } else {
      this.currentTranslation.msgs.push({
        id: id,
        content: value
      });
    }
    this.currentTranslation$.next(this.currentTranslation);
  }

  public setCurrentSource(src: Source) {
    this.currentSource$.next(src);
  }
}
