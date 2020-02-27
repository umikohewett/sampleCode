using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.FaqCategories;
using Sabio.Models.Requests.FAQs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class FAQsService : IFAQsService
    {
        IDataProvider _data = null;
        public FAQsService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(FAQAddRequest model, int currentUserId)
        {
            int id = 0;

            string storedProc = "[dbo].[FAQs_Insert]";
            _data.ExecuteNonQuery(storedProc, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParameters(model, col);

                col.AddWithValue("@CreatedBy", currentUserId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public FAQ Get(int id)
        {

            string procName = "[dbo].[FAQs_SelectById]";

            FAQ faq = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                faq = MapFAQs(reader);

            });

            return faq;
        }

        public Paged<FAQ> GetFAQsPage(int pageIndex, int pageSize)
        {
            Paged<FAQ> pagedResult = null;

            List<FAQ> result = null;

            string procName = "[dbo].[FAQs_SelectAll]";

            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper:
                  delegate (SqlParameterCollection col)
                  {
                      col.AddWithValue("@pageIndex", pageIndex);
                      col.AddWithValue("@pageSize", pageSize);
                  },
                  singleRecordMapper: delegate (IDataReader reader, short set)
                  {
                    FAQ faq = MapFAQs(reader);
                     if (totalCount == 0)
                      {
                         totalCount = reader.GetSafeInt32(10);
                      }
                   
                    if (result == null)
                    {
                        result = new List<FAQ>();
                    }

                    result.Add(faq);
                }
                );
            if (result != null)
            {
                pagedResult = new Paged<FAQ>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;

        }

        public Paged<FAQ> GetCreatedByPage(int createdBy, int pageIndex, int pageSize)
        {
            Paged<FAQ> pagedResult = null;

            List<FAQ> result = null;

            string procName = "[dbo].[FAQs_SelectByCreatedBy]";

            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper:
               delegate (SqlParameterCollection col)
               {
                   col.AddWithValue("@CreatedBy", createdBy);
                   col.AddWithValue("@pageIndex", pageIndex);
                   col.AddWithValue("@pageSize", pageSize);
               },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    FAQ faq = MapFAQs(reader);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(9);
                    }

                    if (result == null)
                    {
                        result = new List<FAQ>();
                    }

                    result.Add(faq);
                }
                );
            if (result != null)
            {
                pagedResult = new Paged<FAQ>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;

        }
        public void Update(FAQUpdateRequest model, int modifiedById)
        {
            string storedProc = "[dbo].[FAQs_Update]";
            _data.ExecuteNonQuery(storedProc, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParameters(model, col);

                col.AddWithValue("@ModifiedBy", modifiedById);
                col.AddWithValue("@Id", model.Id);

            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[FAQs_DeleteById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public List<FAQCategory> GetFAQCategories()
        {
            List<FAQCategory> list = null;

            string procName = "[dbo].[FAQCategories_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                FAQCategory category = new FAQCategory();
                int startingIndex = 0;

                category.Id = reader.GetSafeInt32(startingIndex++);
                category.Name = reader.GetSafeString(startingIndex++);

                if (list == null)
                {
                    list = new List<FAQCategory>();
                }
                list.Add(category);
            });
            return list;
        }
        public int AddCategory(CategoryAddRequest model, int currentUserId)
        {
            int id = 0;

            string storedProc = "[dbo].[FAQCategories_Insert]";
            _data.ExecuteNonQuery(storedProc, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Name", model.Name);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public void UpdateCategory(CategoryUpdateRequest model, int modifiedById)
        {
            string storedProc = "[dbo].[FAQCategories_Update]";
            _data.ExecuteNonQuery(storedProc, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Name", model.Name);
                col.AddWithValue("@Id", model.Id);

            },
            returnParameters: null);
        }

       

        public void DeleteCategory(int id)
        {
            string procName = "[dbo].[FAQCategories_DeleteById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        private static FAQ MapFAQs(IDataReader reader)
        {
            FAQ faq = new FAQ();


            int startingIndex = 0;

            faq.Id = reader.GetSafeInt32(startingIndex++);
            faq.Question = reader.GetSafeString(startingIndex++);
            faq.Answer = reader.GetSafeString(startingIndex++);
            faq.FAQCategory = new FAQCategory();
            faq.FAQCategory.Id = reader.GetSafeInt32(startingIndex++);
            faq.FAQCategory.Name = reader.GetSafeString(startingIndex++);
            faq.SortOrder = reader.GetSafeInt32(startingIndex++);
            faq.DateCreated = reader.GetSafeDateTime(startingIndex++);
            faq.DateModified = reader.GetSafeDateTime(startingIndex++);
            faq.CreatedBy = reader.GetSafeInt32(startingIndex++);
            faq.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return faq;
        }
        private static void AddCommonParameters(FAQAddRequest model, SqlParameterCollection col)
        {

            col.AddWithValue("@Question", model.Question);
            col.AddWithValue("@Answer", model.Answer);
            col.AddWithValue("@CategoryId", model.faqCategory);
            col.AddWithValue("@SortOrder", model.SortOrder);
           
        }
    }
}

