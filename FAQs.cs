﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Domain
{
	public class FAQ
	{
		public int Id { get; set; }
		public string Question { get; set; }
		public string Answer { get; set; }
		public FAQCategory FAQCategory { get; set; }
		public int SortOrder { get; set; }
		public DateTime DateCreated { get; set; }
		public DateTime DateModified { get; set; }
		public int CreatedBy { get; set; }
		public int ModifiedBy { get; set; }


	}
}

