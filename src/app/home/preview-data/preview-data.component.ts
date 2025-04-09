import { Component, ElementRef, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-preview-data',
  standalone: true,
  imports: [MatDialogModule],
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
    const element = this.previewSection.nativeElement;
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('preview.pdf');
    });
  }
  
  downloadAsImage() {
    const element = this.previewSection.nativeElement;
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'preview.png';
      link.click();
    });
  }

  ngOnInit(): void {
    this.showAction = this.data?.showAction;
  }
}
