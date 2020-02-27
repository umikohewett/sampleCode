using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.FAQs
{
    public class FAQAddRequest
    {	[Required]
		[MinLength(1),MaxLength(225)]
		public string Question { get; set; }
		[Required]
		[MinLength(1),MaxLength(2000)]
		public string Answer { get; set; }
		[Required]
		[Range(1, 999)]
		public int faqCategory { get; set; }
		[Required]
		[Range(1, 999)]
		public int SortOrder { get; set; }
		
	

	}
}
