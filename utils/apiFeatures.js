class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filther() {
    //1. Filthering
    const queryObj = Object.assign(this.queryString); //copy the object
    // const excludedFields = ['sort', 'page', 'limit'];
    // excludedFields.forEach((el) => delete queryObj[el]); //will delete fields in excludedFields from queryObj

    //1.1.Advance filthering
    let queryStr = JSON.stringify(queryObj);
    //if match will replace the string with $+matched string. g in there mean it will replace all occurance.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //not working
    // 2. Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // minus sign will sort it in DESCENDING order.
    }

    return this;
  }

  limitFields() {
    //not working
    //3. Limiting fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // const fields = '-name -duration';
      this.query = this.query.select(fields); //TODO: this line don't work
    } else {
      this.query = this.query.select('-__v'); //minus here mean EXCLUDE the field
    }

    return this;
  }

  paginate() {
    //not working
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
