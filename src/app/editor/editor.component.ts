import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import * as SimpleMDE from 'simplemde';
import {ITag} from '../models';
import {PostsService} from '../services/posts.service';
import {previewTag} from '../slice-text.pipe';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  file: File;
  editorForm: FormGroup;

  tags: ITag[];
  @ViewChild('textarea')
  textarea: ElementRef;
  simplemde: SimpleMDE;
  isDataLoaded = false;
  imageIsLoading = false;

  constructor(private fb: FormBuilder,
              private postService: PostsService,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private http: HttpClient) {
  }


  ngOnInit() {
    this.http.get<ITag[]>('api/tags')
      .pipe(finalize(() => {
        this.isDataLoaded = true;
        this.editorForm.get('tags').enable();
        this.changeDetectorRef.markForCheck();
      }))
      .subscribe(data => {
        this.tags = data;
      });
    this.editorForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      tags: [{ value: '', disabled: true }],
      image: ['']
    });
    this.simplemde = new SimpleMDE({
      element: this.textarea.nativeElement,
      spellChecker: false,
      forceSync: true,
      toolbar: ['bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide', '|',
        {
          name: 'preview',
          action: function customFunction(editor) {
            editor.value(editor.value() + `\n${previewTag}\n`);
          },
          className: 'fa fa-scissors',
          title: 'Preview',
        }]
    });

    // subscribe to simpleMDE data changes
    this.simplemde.codemirror.on('change', () => {
      this.editorForm.patchValue({ text: this.simplemde.value() });
      this.editorForm.updateValueAndValidity();
    });
  }

  onFileSelect(file: File) {
    this.imageIsLoading = true;
    this.postService.uploadImage(file)
      .pipe(finalize(() => {
        this.imageIsLoading = false;
      }))
      .subscribe(url => {
        this.editorForm.patchValue({ image: url });
        this.file = file;
        this.changeDetectorRef.markForCheck();
      });
  }

  onSubmit() {
    const prepareData = this.editorForm.value;
    if (prepareData.tags === '') {
      prepareData.tags = [];
    }
    this.postService.createPost(prepareData).subscribe(() => this.router.navigateByUrl('/'));
  }
}
