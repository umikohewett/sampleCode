using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Domain
{
    public class ListingReservationHost : ListingReservations
    {
        public string Name { get; set; }

        public string Title { get; set; }

        public int HostId { get; set; }

        public List<ListingImage> Images { get; set; }

    }
}
