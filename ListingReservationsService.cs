using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Messages;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class ListingReservationsService : IListingReservationsService
    {
        private IDataProvider _dataProvider = null;

        public ListingReservationsService(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
           
        }

        public void DeleteById(int id)
        {
            string procName = "[dbo].[ListingReservations_Delete_ById]";
            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("Id", id);
                },
                returnParameters: null);
        }

        public int Create(ListingReservationsAddRequest model, int userId)
        {
            int id = 0;
            string procName = "dbo.ListingReservations_Insert_V2";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    CommonParams(model, col);
                    col.AddWithValue("@UserId", userId);
                    SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
                    IdOut.Direction = ParameterDirection.Output;
                    col.Add(IdOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public bool GetAvailability(ListingReservationsAddRequest model, int listingId)
        {
            bool isAvailable = false;
            string procName = "[dbo].[ListingReservations_Select_ByListingId_V3]";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@DateCheckIn", model.DateCheckIn);
                    col.AddWithValue("@DateCheckOut", model.DateCheckOut);
                    col.AddWithValue("@ListingId", listingId);

                    SqlParameter boolOut = new SqlParameter("@IsAvailable", SqlDbType.Bit);
                    boolOut.Direction = ParameterDirection.Output;
                    col.Add(boolOut);

                }, returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oBool = returnCol["@IsAvailable"].Value;
                    bool.TryParse(oBool.ToString(), out isAvailable);
                    
                });
            return isAvailable;
        }

        public Paged<ListingReservations> GetAll(int pageIndex, int pageSize)
        {
            Paged<ListingReservations> pagedResult = null;

            List<ListingReservations> list = null;

            int totalCount = 0;

            string procName = "dbo.ListingReservations_SelectAll_V2";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                },
            delegate (IDataReader reader, short set)
            {
                ListingReservations reservation = MapReservation(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(6);
                }

                if (list == null)
                {
                    list = new List<ListingReservations>();
                }

                list.Add(reservation);
            });
            if (list != null)
            {
                pagedResult = new Paged<ListingReservations>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public ListingReservations GetById(int id)
        {
            ListingReservations reservation = null;

            string procName = "dbo.ListingReservations_Select_ById_V2";

            _dataProvider.ExecuteCmd(procName,
            delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                reservation = MapReservation(reader);
            }
            );

            return reservation;
        }
        public ListingReservations GetByReservationId(int id)
        {
            ListingReservations reservation = null;

            string procName = "dbo.ListingReservations_Select_ByReservationId";

            _dataProvider.ExecuteCmd(procName,
            delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                reservation = MapReservationSuccess(reader);                              
            }
            );

            return reservation;
        }

        public Paged<ListingReservations> GetByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<ListingReservations> pagedResult = null;

            List<ListingReservations> list = null;

            int totalCount = 0;

            string procName = "dbo.ListingReservations_Select_ByUserId_V3";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@UserId", userId);
                },
            delegate (IDataReader reader, short set)
            {
                ListingReservations reservation = MapReservationAdditional(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(31);
                }

                if (list == null)
                {
                    list = new List<ListingReservations>();
                }

                list.Add(reservation);
            });
            if (list != null)
            {
                pagedResult = new Paged<ListingReservations>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<ListingReservationHost> GetByHostId(int pageIndex, int pageSize, int userId)
        {
            Paged<ListingReservationHost> pagedResult = null;

            List<ListingReservationHost> list = null;

            int totalCount = 0;

            string procName = "dbo.ListingReservations_Select_ByHostId_V3";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@UserId", userId);
                  

                },
            delegate (IDataReader reader, short set)
            {
                ListingReservationHost reservation = MapReservationHost(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(11);
                }

                if (list == null)
                {
                    list = new List<ListingReservationHost>();
                }

                list.Add(reservation);
            });
            if (list != null)
            {
                pagedResult = new Paged<ListingReservationHost>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<ListingReservations> GetByListingId(int pageIndex, int pageSize, int listingId)
        {
            Paged<ListingReservations> pagedResult = null;

            List<ListingReservations> list = null;

            int totalCount = 0;

            string procName = "dbo.ListingReservations_Select_ByListingId";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@ListingId", listingId);
                },
            delegate (IDataReader reader, short set)
            {
                ListingReservations reservation = MapReservation(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(6);
                }

                if (list == null)
                {
                    list = new List<ListingReservations>();
                }

                list.Add(reservation);
            });
            if (list != null)
            {
                pagedResult = new Paged<ListingReservations>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<ListingReservationHost> GetByHostSearch(string searchQuery, int pageIndex, int pageSize, int hostId)
        {
            Paged<ListingReservationHost> pagedResult = null;

            List<ListingReservationHost> list = null;

            int totalCount = 0;

            string procName = "[dbo].[ListingReservations_SelectByHostId_BySearchQuery_V2]";

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@SearchQuery", searchQuery);
                    paramCollection.AddWithValue("@HostId", hostId);
                }, 
                singleRecordMapper: delegate (IDataReader reader, short set)
            {
                ListingReservationHost reservation = MapReservationHost(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(11);
                }

                if (list == null)
                {
                    list = new List<ListingReservationHost>();
                }

                list.Add(reservation);
            });

            if (list != null)
            {
                pagedResult = new Paged<ListingReservationHost>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

      
    public List<ListingReservations> GetByListingIdV2(int listingId)
    {
        List<ListingReservations> list = null;

        string procName = "dbo.ListingReservations_Select_ByListingId_V4";

        _dataProvider.ExecuteCmd(procName,
            delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@ListingId", listingId);
            },
        delegate (IDataReader reader, short set)
        {
            ListingReservations reservation = MapReservation(reader);

            if (list == null)
            {
                list = new List<ListingReservations>();
            }

            list.Add(reservation);
        });
        if (list != null)
        {
            list = new List<ListingReservations>(list);
        }

        return list;
    }

    public void Update(ListingReservationsUpdateRequest model)
        {
            string procName = "dbo.ListingReservations_Update";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    CommonParams(model, col);
                },
                returnParameters: null);
        }

        public void UpdateStatus(int listingId, int statusId)
        {
            string procName = "dbo.ListingReservations_Update_StatusByListingId";

            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@ListingId", listingId);
                    col.AddWithValue("@StatusId", statusId);
                },
            returnParameters: null);
        }

        public Paged<ListingReservEmailCheck> GetByHostAndCheckout(int pageIndex, int pageSize, int hostUserId)
        {
            Paged<ListingReservEmailCheck> paged = null;

            List<ListingReservEmailCheck> list = null;

            int totalCount = 0;

            string procName = "dbo.ListingReservations_SelectByHostAndCheckout";

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@pageIndex", pageIndex);
                paramCol.AddWithValue("@pageSize", pageSize);
                paramCol.AddWithValue("@HostUserId", hostUserId);
            }, delegate (IDataReader reader, short set)
            {
                ListingReservEmailCheck reservation = new ListingReservEmailCheck();
                int startingIndex = 0;

                reservation.ListingName = reader.GetSafeString(startingIndex++);
                reservation.ListingId = reader.GetSafeInt32(startingIndex++);
                reservation.DateCheckOut = reader.GetSafeDateTime(startingIndex++);
                reservation.IsGuestEmailSent = reader.GetSafeBool(startingIndex++);
                reservation.ReservationId = reader.GetSafeInt32(startingIndex++);
                reservation.HostProfileId = reader.GetSafeInt32(startingIndex++);
                reservation.HostFName = reader.GetSafeString(startingIndex++);
                reservation.HostLName = reader.GetSafeString(startingIndex++);
                reservation.GuestUserId = reader.GetSafeInt32(startingIndex++);
                reservation.GuestFName = reader.GetSafeString(startingIndex++);
                reservation.GuestLName = reader.GetSafeString(startingIndex++);
                reservation.GuestProfileId = reader.GetSafeInt32(startingIndex++);
                reservation.GuestEmail = reader.GetSafeString(startingIndex++);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(13);
                }

                if (list == null)
                {
                    list = new List<ListingReservEmailCheck>();
                }

                list.Add(reservation);
            });

            if (list != null)
            {
                paged = new Paged<ListingReservEmailCheck>(list, pageIndex, pageSize, totalCount);
            }

            return paged;
        }

        public void UpdateGuestEmailSent(int reservationId, bool isGuestEmailSent)
        {
            string procName = "dbo.ListingReservations_UpdateGuestEmailSent";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@IsGuestEmailSent", isGuestEmailSent);
                col.AddWithValue("@ReservationId", reservationId);
            }, returnParameters: null);
        }

        private static void CommonParams(ListingReservationsAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ListingId", model.ListingId);
            col.AddWithValue("@DateCheckIn", model.DateCheckIn);
            col.AddWithValue("@DateCheckOut", model.DateCheckOut);
            col.AddWithValue("@ChargeId", model.ChargeId);
        }

        private static ListingReservations MapReservation(IDataReader reader)
        {
            ListingReservations reservation = new ListingReservations();
            int startingIndex = 0;

            reservation.Id = reader.GetSafeInt32(startingIndex++);
            reservation.ListingId = reader.GetSafeInt32(startingIndex++);
            reservation.DateCheckIn = reader.GetSafeDateTime(startingIndex++);
            reservation.DateCheckOut = reader.GetSafeDateTime(startingIndex++);
            reservation.ChargeId = reader.GetSafeString(startingIndex++);
            reservation.StatusId = reader.GetSafeInt32(startingIndex++);
            reservation.UserId = reader.GetSafeInt32(startingIndex++);    
            
            return reservation;
        }

         private static ListingReservations MapReservationAdditional(IDataReader reader)
        {
            ListingReservations reservation = new ListingReservations();
            SqlDataReader sql = reader as SqlDataReader;
            int startingIndex = 0;

            reservation.Id = reader.GetSafeInt32(startingIndex++);
            reservation.ListingId = reader.GetSafeInt32(startingIndex++);
            reservation.InternalName = reader.GetSafeString(startingIndex++);
            reservation.Title = reader.GetSafeString(startingIndex++);
            reservation.ShortDescription = reader.GetSafeString(startingIndex++);
            reservation.Description = reader.GetSafeString(startingIndex++);
            reservation.BedRooms = reader.GetSafeInt16(startingIndex++);
            reservation.Baths = reader.GetSafeFloat(startingIndex++);
            reservation.HousingType = new HousingType();
            reservation.HousingType.Id = reader.GetSafeInt32(startingIndex++);
            reservation.HousingType.Name = reader.GetSafeString(startingIndex++);
            reservation.AccessType = new AccessType();
            reservation.AccessType.Id = reader.GetSafeInt32(startingIndex++);
            reservation.AccessType.Name = reader.GetSafeString(startingIndex++);
            reservation.AccessType.Description = reader.GetSafeString(startingIndex++);
            reservation.GuestCapacity = reader.GetSafeInt16(startingIndex++);
            reservation.CostPerNight = reader.GetSafeInt32(startingIndex++);
            reservation.CostPerWeek = reader.GetSafeInt32(startingIndex++);
            reservation.CheckInTime = sql.GetSafeTimeSpan(startingIndex++);
            reservation.CheckOutTime = sql.GetSafeTimeSpan(startingIndex++);
            reservation.DaysAvailable = reader.GetSafeInt32(startingIndex++);
            reservation.LocationId = reader.GetSafeInt32(startingIndex++);
            reservation.HasVerifiedOwnership = reader.GetSafeBool(startingIndex++);
            reservation.IsActive = reader.GetSafeBool(startingIndex++);
            reservation.CreatedBy = reader.GetSafeInt32(startingIndex++);
            reservation.DateCreated = reader.GetSafeDateTime(startingIndex++);
            reservation.DateModified = reader.GetSafeDateTime(startingIndex++);
            reservation.DateCheckIn = reader.GetSafeDateTime(startingIndex++);
            reservation.DateCheckOut = reader.GetSafeDateTime(startingIndex++);
            reservation.ChargeId = reader.GetSafeString(startingIndex++);
            reservation.StatusId = reader.GetSafeInt32(startingIndex++);
            reservation.UserId = reader.GetSafeInt32(startingIndex++);
            string images = reader.GetSafeString(startingIndex++);
            if (images != null)
            {
                reservation.Images = JsonConvert.DeserializeObject<List<ListingImage>>(images);
            }
            return reservation;
        }

        private static ListingReservationHost MapReservationHost(IDataReader reader)
        {
            ListingReservationHost reservation = new ListingReservationHost();
            int startingIndex = 0;

            reservation.Id = reader.GetSafeInt32(startingIndex++);
            reservation.ListingId = reader.GetSafeInt32(startingIndex++);
            reservation.DateCheckIn = reader.GetSafeDateTime(startingIndex++);
            reservation.DateCheckOut = reader.GetSafeDateTime(startingIndex++);
            reservation.ChargeId = reader.GetSafeString(startingIndex++);
            reservation.StatusId = reader.GetSafeInt32(startingIndex++);
            reservation.UserId = reader.GetSafeInt32(startingIndex++);
            reservation.Name = reader.GetSafeString(startingIndex++);
            reservation.Title = reader.GetSafeString(startingIndex++);
            reservation.HostId = reader.GetSafeInt32(startingIndex++);

            string images = reader.GetSafeString(startingIndex++);

            if (images != null)
            {
                reservation.Images = JsonConvert.DeserializeObject<List<ListingImage>>(images);
            }

            return reservation;
        }

        private static ListingReservations MapReservationSuccess(IDataReader reader)
        {
            ListingReservations reservation = new ListingReservations();
            int startingIndex = 0;

            reservation.Id = reader.GetSafeInt32(startingIndex++);
            reservation.ListingId = reader.GetSafeInt32(startingIndex++);
            reservation.DateCheckIn = reader.GetSafeDateTime(startingIndex++);
            reservation.DateCheckOut = reader.GetSafeDateTime(startingIndex++);
            reservation.ChargeId = reader.GetSafeString(startingIndex++);
            reservation.StatusId = reader.GetSafeInt32(startingIndex++);
            reservation.UserId = reader.GetSafeInt32(startingIndex++);
            reservation.ReservationPaymentId = reader.GetSafeString(startingIndex++);
            reservation.Description = reader.GetSafeString(startingIndex++);
            reservation.Title = reader.GetSafeString(startingIndex++);
            reservation.FileUrl = reader.GetSafeString(startingIndex++);
            reservation.UserId = reader.GetSafeInt32(startingIndex++);
            reservation.Email = reader.GetSafeString(startingIndex++);

            return reservation;
        }
    }
}