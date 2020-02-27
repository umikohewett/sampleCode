using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.FaqCategories;
using Sabio.Models.Requests.FAQs;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/faqs")]
    [ApiController]
    public class FAQApiController : BaseApiController
    {
        private IFAQsService _faqService = null;
        private IAuthenticationService<int> _authService = null;

        public FAQApiController(IFAQsService faqService,
         ILogger<FAQApiController> logger,
         IAuthenticationService<int> authService) : base(logger)
        {
            _faqService = faqService;
            _authService = authService;

        }


        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(FAQAddRequest model)

        {
            ObjectResult result = null;

            try
            {
                int id = _faqService.Add(model, _authService.GetCurrentUserId());

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [AllowAnonymous]
        [HttpGet("{Id:int}")]
        public ActionResult<ItemResponse<FAQ>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                FAQ faq = _faqService.Get(id);


                if (faq == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("FAQ not found.");
                }
                else
                {

                    response = new ItemResponse<FAQ> { Item = faq };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message }");

            }

            return StatusCode(iCode, response);

        }
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<ItemResponse<Paged<FAQ>>> GetFAQsPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<FAQ> faqsPaged = _faqService.GetFAQsPage(pageIndex, pageSize);

                if (faqsPaged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Page Not Found.");
                }
                else
                {
                    response = new ItemResponse<Paged<FAQ>> { Item = faqsPaged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);

        }

        [AllowAnonymous]
        [HttpGet("feeds")]
        public ActionResult<ItemResponse<Paged<FAQ>>> GetCreatedByPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<FAQ> createdByPaged = _faqService.GetCreatedByPage(_authService.GetCurrentUserId(), pageIndex, pageSize);

                if (createdByPaged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<FAQ>> { Item = createdByPaged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        

        [HttpPut("{Id:int}")]
        public ActionResult<ItemResponse<int>> Update(FAQUpdateRequest model)
        {
            
            int code = 200;
            BaseResponse response = null;

            try
            {
               _faqService.Update(model, _authService.GetCurrentUserId());

              response = new ItemResponse<int>();

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
                code = 500;
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{Id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _faqService.Delete(id);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }
        [AllowAnonymous]
        [HttpGet("categories")]
        public ActionResult<ItemResponse<List<FAQCategory>>> GetFAQCategories()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FAQCategory> list = _faqService.GetFAQCategories();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not Found.");
                }
                else
                {
                    code = 200;
                    response = new ItemResponse<List<FAQCategory>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpPost("addCategory")]
        public ActionResult<ItemResponse<int>> CreateCategory(CategoryAddRequest model)

        {
            ObjectResult result = null;

            try
            {
                int id = _faqService.AddCategory(model, _authService.GetCurrentUserId());

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("updateCategory/{Id:int}")]
        public ActionResult<ItemResponse<int>> UpdateCategory(CategoryUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _faqService.UpdateCategory(model, _authService.GetCurrentUserId());

                response = new ItemResponse<int>();

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
                code = 500;
            }

            return StatusCode(code, response);
        }

        [HttpDelete("category/{Id:int}")]
        public ActionResult<SuccessResponse> DeleteCategory(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _faqService.DeleteCategory(id);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }
    }
}