using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.FAQs
{
   public class FAQUpdateRequest : FAQAddRequest, IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}
