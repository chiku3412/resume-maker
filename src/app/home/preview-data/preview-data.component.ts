import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-preview-data',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './preview-data.component.html'
})
export class PreviewDataComponent implements OnInit {
  showAction: boolean = false;
  @Input() bioDataForm!: FormGroup;
  @Input() url: any;
  @Input() selectedImage: any;
  @ViewChild('previewSection') previewSection!: ElementRef;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: { bioDataForm: FormGroup, showAction: boolean, url: any, selectedImage: any }) {
    this.bioDataForm = data?.bioDataForm ?? ''; // Assign the passed form group
    this.url = data?.url ?? ''; // Assign the passed URL
    this.selectedImage = data?.selectedImage ?? ''; // Assign the passed selected image
  }
  
  /* Form Controls */
  get displayedPersonalDetails() {
    const controls = [
      { label: 'Name', controlName: 'fullName' },
      { label: 'Gender', controlName: 'gender' },
      { label: 'Date Of Birth', controlName: 'dob' },
      { label: 'Place Of Birth', controlName: 'placeOfBirth' },
      { label: 'Marital Status', controlName: 'maritalStatus' },
      { label: 'Religion', controlName: 'religion' },
      { label: 'Mother Tongue', controlName: 'motherTongue' },
      { label: 'Caste', controlName: 'caste' },
      { label: 'Sub Caste', controlName: 'subCaste' },
      { label: 'Education', controlName: 'education' },
      { label: 'Job/Occupation', controlName: 'occupation' },
      { label: 'Organization Name', controlName: 'organizationName' },
      { label: 'Annual Income', controlName: 'annualIncome' },
    ];

    return controls
    .map(field => {
      let value = this.bioDataForm.get(field.controlName)?.value;

      // Format dob if it's a Moment object
      if (field.controlName === 'dob' && value?.format) {
        value = value.format('DD-MMMM-YYYY');
      }

      return {
        label: field.label,
        value
      };
    })
    .filter(field => !!field.value);
  }

  get displayedFamilyDetails() {
    const controls = [
      { label: "Father's Name", controlName: 'fatherName' },
      { label: "Father's Occupation", controlName: 'fatherOccupation' },
      { label: "Mother's Name", controlName: 'motherName' },
      { label: "Mother's Occupation", controlName: 'motherOccupation' },
      { label: "Total Brothers", controlName: 'totalBrother' },
      { label: "Total Sisters", controlName: 'totalSister' },
      { label: "Married Brothers", controlName: 'marriedBrother' },
      { label: "Married Sisters", controlName: 'marriedSister' },
    ];

    return controls
    .map(field => {
      let value = this.bioDataForm.get(field.controlName)?.value;
      return {
        label: field.label,
        value
      };
    })
    .filter(field => !!field.value);
  }

  get displayedContactDetails() {
    const controls = [
      { label: "Contact No", controlName: 'contactNo' },
      { label: "Father's Contact No", controlName: 'fatherContactNo' },
      { label: "Mother's Contact No", controlName: 'motherContactNo' },
      { label: "Address", controlName: 'address' },
      { label: "Email ID", controlName: 'email' }
    ];

    return controls
    .map(field => {
      let value = this.bioDataForm.get(field.controlName)?.value;
      return {
        label: field.label,
        value
      };
    })
    .filter(field => !!field.value);
  }

  downloadAsPdf() {
    const el = this.previewSection.nativeElement;
    html2canvas(el, { scale: 2 }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const [w, h] = [pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight()];
      const imgW = w;
      const imgH = (canvas.height * imgW) / canvas.width;
      const scale = canvas.width / imgW;
      const pageHpx = h * scale;
  
      const ctx = (document.createElement('canvas').getContext('2d')!);
      let pos = 0, remain = canvas.height;
  
      while (remain > 0.5) {
        const chunk = Math.min(pageHpx, remain);
        ctx.canvas.width = canvas.width;
        ctx.canvas.height = chunk;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, chunk);
        ctx.drawImage(canvas, 0, pos, canvas.width, chunk, 0, 0, canvas.width, chunk);
        const img = ctx.canvas.toDataURL('image/png');
        pdf.addImage(img, 'PNG', 0, 0, imgW, (chunk * imgW) / canvas.width);
        remain -= chunk;
        pos += chunk;
        if (remain > 0.5) pdf.addPage();
      }
  
      pdf.save('preview.pdf');
    });
  }
    
  
  downloadAsImage() {
    const element = this.previewSection.nativeElement;
  
    html2canvas(element, { scale: 2 }).then(originalCanvas => {
      // A4 size at 96 DPI = 794 x 1123 pixels (portrait)
      const a4Width = 794;
      const a4Height = 1123;
  
      const a4Canvas = document.createElement('canvas');
      a4Canvas.width = a4Width;
      a4Canvas.height = a4Height;
  
      const ctx = a4Canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff'; // white background
      ctx.fillRect(0, 0, a4Width, a4Height);
  
      // Scale the original canvas to fit within A4
      const scale = Math.min(a4Width / originalCanvas.width, a4Height / originalCanvas.height);
      const scaledWidth = originalCanvas.width * scale;
      const scaledHeight = originalCanvas.height * scale;
  
      const x = (a4Width - scaledWidth) / 2;
      const y = (a4Height - scaledHeight) / 2;
  
      ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, x, y, scaledWidth, scaledHeight);
  
      const imgData = a4Canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'preview-a4.png';
      link.click();
    });
  }  

  ngOnInit(): void {
    this.showAction = this.data?.showAction;
  }
}
